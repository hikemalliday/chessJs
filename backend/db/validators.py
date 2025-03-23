def post_refresh(payload):
    if not isinstance(payload, dict):
        raise ValueError("Invalid post_refresh payload: must be a dict")
    if not (len(payload.keys()) == 1):
        raise ValueError("Invalid post_refresh payload: invalid amount of keys")
    if not "refresh" in payload:
        raise ValueError("Invalid post_refresh payload: must contain 'refresh' key")


def post_login(payload):
    if not isinstance(payload, dict):
        raise ValueError("Invalid post_login payload: must be a dict")
    if not (len(payload.keys()) == 2):
        raise ValueError("Invalid post_login payload: invalid amount of keys")
    if not "username" in payload:
        raise ValueError("Invalid post_login payload: must contain 'username' key")
    if not "password" in payload:
        raise ValueError("Invalid post_login payload: must contain 'password' key")


def post_signup(payload):
    if not isinstance(payload, dict):
        raise ValueError("Invalid post_signup payload: must be a dict")
    if not (len(payload.keys()) == 2):
        raise ValueError("Invalid post_signup payload: invalid amount of keys")
    if not "username" in payload:
        raise ValueError("Invalid post_signup payload: must contain 'username' key")
    if not "password" in payload:
        raise ValueError("Invalid post_signup payload: must contain 'password' key")


def post_game_state(payload):
    if not isinstance(payload, dict):
        raise ValueError("Invalid post_game_state payload: must be a dict")
    if not (len(payload.keys()) == 2):
        raise ValueError("Invalid post_game_state payload: invalid amount of keys")
    if not "activePlayer" in payload:
        raise ValueError("Invalid post_game_state payload: must contain 'activePlayer' key")
    if not "gameState" in payload:
        raise ValueError("Invalid post_game_state payload: must contain 'gameState' key")
    

