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
from . import serializers


load_dotenv()


class DbHandler:

    def __init__(self):
        self.SECRET = os.getenv("SECRET", None)
        self.conn = sqlite3.connect("game.db", check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.queries = queries
        self.tables = {
            # Active player could be either user id or just 'white' / 'black'
            "game_state": """
        CREATE TABLE IF NOT EXISTS game_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activePlayer TEXT NOT NULL,
        gameState TEXT NOT NULL,
        game INTEGER NOT NULL,
        FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
        )
        """,
            # In the 'game' table, I think that 'white' and 'black' should be ID's that correspond to a user. This would require that if anyone wants to play they must sign up,
            # not sure how we would handle guests. I guess that guest coTestuld just auto create a user. User ID could be stored in tokens
            "game": """
        CREATE TABLE IF NOT EXISTS game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        white TEXT,
        black TEXT,
        is_started INTEGER NOT NULL CHECK (is_started IN (0, 1)) DEFAULT 0,
        uuid TEXT NOT NULL,
        FOREIGN KEY (white) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (black) REFERENCES users(id) ON DELETE CASCADE
        )
        """,
            "users": """
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        uuid TEXT NOT NULL
        )
        """,
        }

    def _get_query_param_query(self, query, query_params):
        values = []
        for i, (k, v) in enumerate(query_params.items()):
            if i == 0:
                query += f" WHERE {k} = ?"
            else:
                query += f" AND WHERE {k} = ?"
            values.append(v)
        return query, tuple(values)

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
            query, values = self._get_query_param_query(
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
        
    # Not sure if we need to do this here, but we need to insert the game id for each entry here
    # We should prolly select the correct game from uuid and get the ID that way, to preserve data integrity
    def post_game_state(self, payload, **kwargs):
        try:
            validators.post_game_state(payload)
            active_player = payload["activePlayer"]
            game_state = payload["gameState"]
            game = payload["game"]
            self.cursor.execute(
                self.queries["post_game_state"],
                (active_player, json.dumps(game_state), game),
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
            return {
                "message": "Account created successfully.",
                "access": create_jwt({"uuid": uuid}, self.SECRET, **{"minutes": 120}),
                "refresh": create_jwt({"uuid": uuid}, self.SECRET, **{"days": 7}),
            }
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
                return {
                    "message": "Login successful",
                    "access": create_jwt(
                        {"uuid": uuid}, self.SECRET, **{"minutes": 120}
                    ),
                    "refresh": create_jwt({"uuid": uuid}, self.SECRET, **{"days": 7}),
                }
        except ValueError as e:
            raise ValueError(f"db_handler.post_login: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_login: Unexpected error: {e}") from e

    def post_create_game(self, _, uuid=None, **kwargs):
        # UUID arg here represents the user creating the game
        try:
            game_uuid = str(uuid4())
            self.cursor.execute(self.queries["post_create_game"], (uuid, game_uuid))
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
