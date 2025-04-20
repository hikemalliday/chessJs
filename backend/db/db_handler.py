import os
from uuid import uuid4
from dotenv import load_dotenv
import sqlite3
import json
import bcrypt
from db import validators
from db.mock_data import starting_game_state
from helper import create_jwt, hash_password
from .queries import queries
from .tables import tables
from . import serializers
from .helpers import _get_query_param_query, _post_signup_response, _post_login_response


load_dotenv()


class DbHandler:

    def __init__(self):
        self.SECRET = os.getenv("SECRET", None)
        self.conn = sqlite3.connect("game.db", check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.queries = queries
        self.tables = tables

    def create_tables(self):
        try:
            for _, query in self.tables.items():
                self.cursor.execute(query)
                self.conn.commit()
        except Exception as e:
            print(f"ERROR: Could not create table: {e}")

    def insert_mock_game(self):
        values = ("white-player", "black-player", "mock-uuid")
        self.cursor.execute(self.queries["insert_mock_game"], values)
        self.conn.commit()

    def insert_starting_game_state(self):
        values = ("white", json.dumps(starting_game_state), 1)
        self.cursor.execute(self.queries["insert_starting_game_state"], values)
        self.conn.commit()

    def get_game_state(self, uuid=None):
        try:
            self.cursor.execute(self.queries["get_game_state"], (uuid,))
            game_state_row = self.cursor.fetchone()
            if not game_state_row:
                raise ValueError(
                    "db_handler.get_game_state: row not found in database."
                )
            return serializers.GameStateSerializer(
                query_response=game_state_row
            ).serialize_data()
        except ValueError as e:
            raise ValueError(f"db_handler.get_game_state: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.get_game_state: Unexpected error: {e}") from e

    def get_games(self, query_params):
        try:
            query, values = _get_query_param_query(
                self.queries["get_games"], query_params
            )
            self.cursor.execute(query, values)
            rows = self.cursor.fetchall()
            if not rows:
                raise ValueError("db_handler.get_games: rows not found in database.")
            return serializers.GameSerializer(
                query_response=rows, many=True
            ).serialize_data()
        except ValueError as e:
            raise ValueError(f"db_handler.get_games: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.get_games: Unexpected error: {e}") from e

    def post_game_state(self, payload, **kwargs):
        try:
            validators.post_game_state(payload)
            game = self.cursor.execute(
                self.queries["get_game_from_uuid"], (payload["uuid"],)
            ).fetchone()
            serialized_game = serializers.GameSerializer(
                query_response=game
            ).serialize_data()
            active_player = payload["activePlayer"]
            game_state = payload["gameState"]
            self.cursor.execute(
                self.queries["post_game_state"],
                (active_player, json.dumps(game_state), serialized_game["id"]),
            )
            self.conn.commit()
            return {"message": "Successfully inserted into 'game_state' table."}
        except ValueError as e:
            raise ValueError(f"db_handler.post_game_state: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_game_state: Unexpected error: {e}") from e

    def post_signup(self, payload, **kwargs):
        try:
            validators.post_signup(payload)
            username = payload["username"]
            hashed_password = hash_password(payload["password"])
            uuid = str(uuid4())
            self.cursor.execute(
                self.queries["post_signup"], (username, hashed_password, uuid)
            )
            self.conn.commit()
            return _post_signup_response(uuid, self.SECRET)
        except sqlite3.IntegrityError as e:
            raise ValueError("db_handler.post_signup: Username already exists") from e
        except ValueError as e:
            raise ValueError(f"db_handler.post_signup: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_signup: Unexpected error: {e}") from e

    def post_login(self, payload, **kwargs):
        try:
            validators.post_login(payload)
            username = payload["username"]
            password = payload["password"]
            self.cursor.execute(self.queries["post_login"], (username,))
            result = self.cursor.fetchone()
            if result is None:
                raise ValueError("db_handler.post_login: Invalid username or password")

            stored_hashed_password = result[0]
            uuid = result[1]

            if bcrypt.checkpw(
                password.encode("utf-8"), stored_hashed_password.encode("utf-8")
            ):
                return _post_login_response(uuid, self.SECRET)
        except ValueError as e:
            raise ValueError(f"db_handler.post_login: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_login: Unexpected error: {e}") from e

    def post_create_game(self, payload, **kwargs):
        try:
            validators.post_create_game(payload)
            game_uuid = str(uuid4())
            user_id = self.cursor.execute(self.queries["get_user_id_from_uuid"], (payload["uuid"],)).fetchone()
            self.cursor.execute(
                self.queries["post_create_game"], (user_id[0], game_uuid)
            )
            self.conn.commit()
            game_id = self.cursor.lastrowid
            game = self.cursor.execute(
                self.queries["get_game_from_id"], (game_id,)
            ).fetchone()
            return serializers.GameSerializer(query_response=game).serialize_data()
        except ValueError as e:
            raise ValueError(f"db_handler.post_create_game: {e}") from e
        except Exception as e:
            raise Exception(
                f"db_handler.post_create_game: Unexpected error: {e}"
            ) from e
