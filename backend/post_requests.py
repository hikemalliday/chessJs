
def post_game_state(db_handler, payload):
    return db_handler.post_game_state(payload)

def post_start_game(db_handler, payload):
    return db_handler.post_game_state(payload)

def post_login(db_handler, payload):
    return db_handler.post_login(payload)