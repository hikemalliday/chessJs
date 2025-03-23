from exception_classes import AuthenticationError
import db.validators as validators
from helper import create_jwt, decode_jwt


# GET Requests
def get_game_state(db_handler):
    return db_handler.get_game_state()


# POST Requests
def post_game_state(db_handler, payload):
    return db_handler.post_game_state(payload)


def post_start_game(db_handler, payload):
    return db_handler.post_game_state(payload)


def post_login(db_handler, payload):
    return db_handler.post_login(payload)


def post_refresh(_, payload):
    validators.post_refresh(payload)
    refresh = payload["refresh"]
    if not decode_jwt(refresh):
        raise AuthenticationError("post_refresh: Invalid refresh token.")
    return {"access": create_jwt({"minutes": 120})}


def post_signup(db_handler, payload):
    return db_handler.post_signup(payload)
