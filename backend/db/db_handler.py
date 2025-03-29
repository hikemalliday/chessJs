import os
from dotenv import load_dotenv
import sqlite3
import json
import bcrypt
import db.validators as validators
from db.mock_data import starting_game_state
from helper import create_jwt, hash_password

load_dotenv()


class DbHandler:

    def __init__(self):
        self.SECRET = os.getenv("SECRET", None)
        self.conn = sqlite3.connect("game.db", check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.queries = {
            "post_signup": """INSERT INTO users (username, hashed_password) VALUES (?, ?)""",
            "post_login": """SELECT hashed_password FROM users WHERE username = ? LIMIT 1""",
            "post_game_state": """INSERT INTO game_state (activePlayer, gameState, game) VALUES (?, ?, ?)""",
            "get_game_state": """SELECT activePlayer, gameState, game FROM game_state ORDER BY id DESC LIMIT 1""",
            "insert_starting_game_state": """INSERT INTO game_state (activePlayer, gameState, game) VALUES (?, ?, ?)""",
            "insert_mock_game": """INSERT INTO game (white, black) VALUES (?, ?)""",
            "post_create_game": """INSERT INTO game (white) VALUES (?)""",
            "get_created_game_id": """SELECT (id) FROM game WHERE id = ?"""
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
        black TEXT NOT NULL,
        is_started INTEGER NOT NULL CHECK (is_started IN (0, 1)) DEFAULT 0
        )
        """,
            "users": """
        CREATE TABLE IF NOT EXISTS users (
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

    def insert_mock_game(self):
        values = ("white-player", "black-player")
        self.cursor.execute(self.queries["insert_mock_game"], values)
        self.conn.commit()

    def insert_starting_game_state(self):
        values = ("white", json.dumps(starting_game_state), 1)
        self.cursor.execute(self.queries["insert_starting_game_state"], values)
        self.conn.commit()

    def get_game_state(self):
        try:
            self.cursor.execute(self.queries["get_game_state"])
            row = self.cursor.fetchone()
            if not row:
                raise ValueError(
                    "db_handler.get_game_state: row not found in database."
                )
            return {
                "message": "Succesfully retrieved game_state row from database",
                "activePlayer": row[0],
                "gameState": json.loads(row[1]),
            }
        except ValueError as e:
            raise ValueError(f"db_handler.get_game_state: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.get_game_state: Unexpected error: {e}") from e

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
        except ValueError as e:
            raise ValueError(f"db_handler.post_game_state: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_game_state: Unexpected error: {e}") from e

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
                "access": create_jwt({}, self.SECRET, **{"minutes": 120}),
                "refresh": create_jwt({},self.SECRET, **{"days": 7}),
            }
        except sqlite3.IntegrityError as e:
            raise ValueError("Username already exists") from e
        except ValueError as e:
            raise ValueError(f"db_handler.post_signup: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_signup: Unexpected error: {e}") from e

    def post_login(self, payload):
        try:
            validators.post_login(payload)
            username = payload["username"]
            password = payload["password"]
            self.cursor.execute(self.queries["post_login"], (username,))
            result = self.cursor.fetchone()
            if result is None:
                raise ValueError("db_handler.post_login: Invalid username or password")

            stored_hashed_password = result[0]
            if bcrypt.checkpw(
                password.encode("utf-8"), stored_hashed_password.encode("utf-8")
            ):
                return {
                    "message": "Login successful",
                    "access": create_jwt({}, self.SECRET, **{"minutes": 120}),
                    "refresh": create_jwt({}, self.SECRET, **{"days": 7}),
                }
        except ValueError as e:
            raise ValueError(f"db_handler.post_login: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_login: Unexpected error: {e}") from e

    def post_create_game(self, payload):
        try:
            validators.post_create_game(payload)
            white_ip = payload["white"]
            self.cursor.execute(self.queries["post_create_game"], (white_ip,))
            self.conn.commit()
            game_id = self.cursor.lastrowid
            return {
                "message": "Game created successfully",
                "game_id": game_id,
            }
        except ValueError as e:
            raise ValueError(f"db_handler.post_create_game: {e}") from e
        except Exception as e:
            raise Exception(f"db_handler.post_create_game: Unexpected error: {e}") from e
        

        
    
