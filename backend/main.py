from rest.api_handler import ThreadingHTTPServer, APIHandler
from db.db_handler import DbHandler


if __name__ == "__main__":
    db_handler = DbHandler()
    db_handler.create_tables()
    APIHandler.db_handler = db_handler
    port = 8001
    server_address = ("", port)
    httpd = ThreadingHTTPServer(server_address, APIHandler)
    print(f"Starting threaded server on port {port}...")
    httpd.serve_forever()

