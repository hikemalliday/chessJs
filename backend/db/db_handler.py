import os
from dotenv import load_dotenv
import sqlite3
import json
import bcrypt
import backend.db.validators as validators
from backend.db.mock_data import starting_game_state
from backend.helper import create_jwt, decode_jwt, hash_password
from backend.exception_classes import AuthenticationError

load_dotenv()


class DbHandler:

    def __init__(self):
        self.SECRET = os.getenv("SECRET", None)
        self.conn = sqlite3.connect("game.db", check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.queries = {
            "post_signup": """INSERT INTO user (username, hashed_password) VALUES (?, ?)""",
            "post_login": """SELECT hashed_password FROM user WHERE username = ?""",
            "post_game_state": """INSERT INTO game_state (activePlayer, gameState, game) VALUES (?, ?, ?)""",
            "get_game_state": """SELECT (activePlayer, gameState, game) FROM game_state ORDER BY id DESC LIMIT 1""",
        }
        self.tables = {
            "game_state": """
        CREATE TABLE IF NOT EXISTS game_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activePlayer TEXT NOT NULL,
        gameState TEXT NOT NULL,
        game INTEGER NOT NULL,
        FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
        )
        """,
            "game": """
        CREATE TABLE IF NOT EXISTS game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        white TEXT NOT NULL,
        black TEXT NOT NULL
        )
        """,
            "user": """
        CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        hashed_password TEXT NOT NULL
        )
        """,
        }

    def create_tables(self):
        try:
            for _, query in self.tables.items():
                self.cursor.execute(query)
                self.conn.commit()
        except Exception as e:
            print(f"ERROR: Could not create table: {e}")

    def insert_starting_game_state(self):
        values = ("white", json.dumps(starting_game_state))
        self.cursor.execute(self.insert_query, values)
        self.conn.commit()

    def get_game_state(self):
        try:
            self.cursor.execute(self.queries["get_game_state"])
            row = self.cursor.fetchone()
            if not row:
                raise ValueError("get_game_state: row not found in database.")
            return {
                "message": "Succesfully retrieved game_state row from database",
                "activePlayer": row[1],
                "gameState": json.loads(row[2]),
            }
        except Exception as e:
            raise Exception(f"get_game_state: Unexpected error: {e}")

    # This doesnt need to be here, it doesnt touch the DB. We should probably move some things out of here
    def post_refresh(self, payload):
        validators.post_refresh(payload)
        refresh = payload["refresh"]
        if not decode_jwt(refresh):
            raise AuthenticationError("post_refresh: Invalid refresh token.")
        return {"access": create_jwt({"minutes": 120}, self.SECRET)}

    def post_game_state(self, payload):
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
        except Exception as e:
            raise Exception(f"post_game_state: Unexpected error: {e}")

    def post_signup(self, payload):
        try:
            validators.post_signup(payload)
            username = payload["username"]
            hashed_password = hash_password(payload["password"])
            self.cursor.execute(
                self.queries["post_signup"], (username, hashed_password)
            )
            self.conn.commit()
            return {
                "message": "Account created successfully.",
                "access": create_jwt({"minutes": 120}, self.SECRET),
                "refresh": create_jwt({"days": 7}, self.SECRET),
            }
        except sqlite3.IntegrityError as e:
            raise ValueError("Username already exists") from e
        except Exception as e:
            raise Exception(f"post_signup: Unexpected error: {e}") from e

    def post_login(self, payload):
        try:
            validators.post_login(payload)
            username = payload["username"]
            password = payload["password"]
            self.cursor.execute(self.queries["post_login"], (username,))
            result = self.cursor.fetchone()
            if result is None:
                raise ValueError("post_login: Invalid username or password")

            stored_hashed_password = result[0]
            if bcrypt.checkpw(
                password.encode("utf-8"), stored_hashed_password.encode("utf-8")
            ):
                return {
                    "message": "Login successful",
                    "access": create_jwt({"minutes": 120}, self.SECRET),
                    "refresh": create_jwt({"days": 7}, self.SECRET),
                }
        except Exception as e:
            raise Exception(f"post_login: Unexpected error: {e}") from e
