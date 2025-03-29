import os
from rest.api_handler import ThreadingHTTPServer, APIHandler
from db.db_handler import DbHandler
from helper import create_jwt
from logger import logger


if __name__ == "__main__":
    print(create_jwt({}, os.getenv("SECRET", None), minutes=120))
    db_handler = DbHandler()
    db_handler.create_tables()
    db_handler.insert_mock_game()
    db_handler.insert_starting_game_state()
    APIHandler.db_handler = db_handler
    port = 8001
    server_address = ("", port)
    httpd = ThreadingHTTPServer(server_address, APIHandler)
    print(f"Starting threaded server on port {port}...")
    httpd.serve_forever()
