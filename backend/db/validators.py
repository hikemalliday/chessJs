import json


def _validate_game_state_object(game_state):
    if len(game_state) != 8:
        raise ValueError(
            "Invalid post_game_state payload: 'gameState' must have len == 8"
        )
    for element in game_state:
        if len(element) != 8:
            raise ValueError(
                "Invalid post_game_state payload: 'gameState' elements must have len == 8"
            )


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
    if not (len(payload.keys()) == 3):
        raise ValueError("Invalid post_game_state payload: invalid amount of keys")
    if not "activePlayer" in payload:
        raise ValueError(
            "Invalid post_game_state payload: must contain 'activePlayer' key"
        )
    if not "gameState" in payload:
        raise ValueError(
            "Invalid post_game_state payload: must contain 'gameState' key"
        )
    if not "game" in payload:
        raise ValueError("Invalid post_game_state payload: must contain 'game' key")
    _validate_game_state_object(payload["gameState"])


def post_create_game(payload):
    if not isinstance(payload, dict):
        raise ValueError("Invalid post_create_game payload: must be a dict")
    if not (len(payload.keys()) == 1):
        raise ValueError("Invalid post_create_game payload: invalid amount of keys")
    if not "white" in payload:
        raise ValueError("Invalid post_create_game payload: must contain 'white' key")

    


