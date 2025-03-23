def post_game_state(db_handler, payload):
    return db_handler.post_game_state(payload)


def post_start_game(db_handler, payload):
    return db_handler.post_game_state(payload)


def post_login(db_handler, payload):
    return db_handler.post_login(payload)


def post_refresh(db_handler, payload):
    return db_handler.post_refresh(payload)


def post_signup(db_handler, payload):
    return db_handler.post_signup(payload)
