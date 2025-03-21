import json
import socketserver
from http.server import BaseHTTPRequestHandler, HTTPServer
from get_requests import get_game_state
from constants import ALLOWED_ORIGINS


class ThreadingHTTPServer(socketserver.ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread"""
    pass


class APIHandler(BaseHTTPRequestHandler):

    db_handler = None
    
    GET_REQUESTS = {
        "/get_game_state": get_game_state,
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

    def do_GET(self):
        try:
            response = self.GET_REQUESTS[self.path](self.db_handler)

        except KeyError:
            response = {"error": "Endpoint not found"}
            self._set_headers(status=404)
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return
        
        self._set_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))