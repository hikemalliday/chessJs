from rest.api_handler import ThreadingHTTPServer, APIHandler


if __name__ == "__main__":
    port = 8001
    server_address = ("", port)
    httpd = ThreadingHTTPServer(server_address, APIHandler)
    print(f"Starting threaded server on port {port}...")
    httpd.serve_forever()