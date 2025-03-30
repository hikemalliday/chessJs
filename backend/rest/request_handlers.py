import os
from exception_classes import AuthenticationError
import db.validators as validators
from helper import create_jwt, decode_jwt


# GET Requests
def get_game_state(db_handler, _, **kwargs):
    return db_handler.get_game_state()


def get_games(db_handler, query_params, **kwargs):
    return db_handler.get_games(query_params)


# POST Requests
def post_game_state(db_handler, payload, **kwargs):
    return db_handler.post_game_state(payload, **kwargs)


def post_start_game(db_handler, payload, **kwargs):
    return db_handler.post_game_state(payload, **kwargs)


def post_login(db_handler, payload, **kwargs):
    return db_handler.post_login(payload, **kwargs)


def post_refresh(_, payload, **kwargs):
    validators.post_refresh(payload)
    refresh = payload["refresh"]
    decoded = decode_jwt(refresh)
    if not decoded:
        raise AuthenticationError("post_refresh: Invalid refresh token.")
    return {"access": create_jwt({"uuid": decoded["uuid"]}, os.getenv("SECRET", None), {"minutes": 120})}


def post_signup(db_handler, payload, **kwargs):
    return db_handler.post_signup(payload, **kwargs)


def post_create_game(db_handler, payload, **kwargs):
    return db_handler.post_create_game(payload, **kwargs)
