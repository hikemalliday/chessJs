import os
import jwt
from dotenv import load_dotenv
import json
import socketserver
from http.server import BaseHTTPRequestHandler, HTTPServer
from rest.request_handlers import (
    get_game_state,
    post_game_state,
    post_start_game,
    post_login,
    post_refresh,
    post_signup,
)
from constants import ALLOWED_ORIGINS, ALLOWED_METHODS
from exception_classes import AuthenticationError

load_dotenv()


class ThreadingHTTPServer(socketserver.ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread"""

    pass


# TODO Should we be using constructor here?
class APIHandler(BaseHTTPRequestHandler):
    SECRET = os.getenv("SECRET", None)
    db_handler = None
    exempt_verification_routes = ["/login", "/signup"]
    GET_REQUESTS = {
        "/game_state": get_game_state,
    }
    POST_REQUESTS = {
        "/signup": post_signup,
        "/login": post_login,
        "/game_state": post_game_state,
        "/start_game": post_start_game,
        "/refresh": post_refresh,
    }

    def _set_headers(self, status=200):
        self.send_response(status)
        origin = self.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
        else:
            self.send_header("Access-Control-Allow-Origin", "null")

        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Headers", "authorization")
        # Can these be condensed to one line?
        self.send_header("Access-Control-Allow-Methods", ALLOWED_METHODS)
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
        self.end_headers()

    # TODO:Hide algo in config or env
    def _validate_token(self):
        try:
            raw_access = self.headers.get("Authorization")
            if not raw_access:
                raise AuthenticationError("Missing Authorization header")
            if not raw_access.startswith("Bearer "):
                raise AuthenticationError("Invalid Authorization header format")
            access = raw_access.split("Bearer ")[1]
            return jwt.decode(access, self.SECRET, ["HS256"])
        except jwt.ExpiredSignatureError as e:
            raise AuthenticationError(f"ExperimentSignatureError: {e}") from e
        except jwt.InvalidTokenError as e:
            raise AuthenticationError(f"InvalidTokenError: {e}") from e
        except Exception as e:
            raise Exception(f"_validate_token: Unexpected error: {e}") from e

    def _handle_err_response(self, err_type, exc, status_code):
        response = {"message": f"{err_type}: {exc}"}
        self._set_headers(status=status_code)
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def _handle_success_response(self, response):
        self._set_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        try:
            self._validate_token()
            response = self.GET_REQUESTS[self.path](self.db_handler)
        except KeyError as e:
            return self._handle_err_response("KeyError", e, 404)
        except AuthenticationError as e:
            return self._handle_err_response("AuthenticationError", e, 401)
        except Exception as e:
            return self._handle_err_response("Exception", e, 500)
        return self._handle_success_response(response)

    def do_POST(self):
        try:
            if self.path not in self.exempt_verification_routes:
                self._validate_token()
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode("utf-8"))
            response = self.POST_REQUESTS[self.path](self.db_handler, payload)
        except KeyError as e:
            return self._handle_err_response("KeyError", e, 404)
        except ValueError as e:
            return self._handle_err_response("ValueError", e, 400)
        except AuthenticationError as e:
            return self._handle_err_response("AuthenticationError", e, 401)
        except Exception as e:
            return self._handle_err_response("Exception", e, 500)
        return self._handle_success_response(response)
