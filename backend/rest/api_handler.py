import json
import socketserver
from http.server import BaseHTTPRequestHandler, HTTPServer
from get_requests import get_game_state
from post_requests import post_game_state
from constants import ALLOWED_ORIGINS


class ThreadingHTTPServer(socketserver.ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread"""
    pass


class APIHandler(BaseHTTPRequestHandler):

    db_handler = None
    
    GET_REQUESTS = {
        "/get_game_state": get_game_state,
    }

    POST_REQUESTS = {
        "/post_game_state": post_game_state,
    }

    def _set_headers(self, status=200):
        self.send_response(status)

        origin = self.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            self.send_header('Access-Control-Allow-Origin', 'null')
            
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def _handle_err_response(self, err_type, exc, status_code):
        response = {"error": f"{err_type}: {exc}"}
        self._set_headers(status=status_code)
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def _handle_success_response(self, response):
        self._set_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_GET(self):
        try:
            response = self.GET_REQUESTS[self.path](self.db_handler)
        except KeyError as e:
            return self._handle_err_response("KeyError", e, 404)
        return self._handle_success_response(response)

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode('utf-8'))
            response = self.POST_REQUESTS[self.path](self.db_handler, payload)
        except KeyError as e:
            return self._handle_err_response("KeyError", e, 404)
        except ValueError as e:
            return self._handle_err_response("ValueError", e, 400)
        return self._handle_success_response(response)

        
    