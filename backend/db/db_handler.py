import sqlite3
import json
import bcrypt
from db.mock_data import starting_game_state
from ..helper import create_jwt

class DbHandler():

    game_state_table = """
CREATE TABLE IF NOT EXISTS game_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activePlayer TEXT NOT NULL,
    gameState TEXT NOT NULL,
    game INTEGER NOT NULL,
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
"""

    game_table = """
CREATE TABLE IF NOT EXISTS game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    white TEXT NOT NULL,
    black TEXT NOT NULL,
)
"""

    tables = [game_state_table, game_table]

    def __init__(self):
        self.conn = sqlite3.connect("game.db", check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.insert_query = """
            INSERT INTO game_state (activePlayer, gameState) VALUES (?, ?)
            """
        self.get_game_state_query = """SELECT * FROM game_state ORDER BY id DESC LIMIT 1"""
        self.post_login_query = """SELECT * FROM users WHERE username = ? AND password = ?"""

    def create_tables(self):
        try:
            for table in self.tables:
                self.cursor.execute(table)
                self.conn.commit()
        except Exception as e:
            print(f"ERROR: Could not create table: {e}")
    
    def insert_starting_game_state(self):
        values = ("white", json.dumps(starting_game_state))
        self.cursor.execute(self.insert_query, values)
        self.conn.commit()

    def get_game_state(self):
        self.cursor.execute(self.get_game_state_query)
        row = self.cursor.fetchone()
        if not row:
            return []
        return {"activePlayer": row[1], "gameState": json.loads(row[2])}
    
    def post_game_state(self, payload):
        if not isinstance(payload, dict) or not "activePlayer" in payload or not "gameState" in payload:
            raise ValueError("Invalid post_game_state payload. Must be dict and have the correct keys.")
        active_player = payload["activePlayer"]
        game_state = payload["gameState"]
        self.cursor.execute(self.insert_query, (active_player, json.dumps(game_state)))
        self.conn.commit()
        return {"message": "Successfully inserted into 'game_state' table."}
    
    def post_login(self, payload):
        if not isinstance(payload, dict) or not "username" in payload or not "password" in payload:
            raise ValueError("Invalid post_login payload. Must be dict and have the correct keys.")
        username = payload["username"]
        password = payload["password"]
        self.cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        result = self.cursor.fetchone()
        if result is None:
            return {"success": False, "message": "Invalid username or password"}
        
        stored_hashed_password = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
            return {"success": True, "message": "Login successful",  "token": create_jwt}
        else:
            return {"success": False, "message": "Invalid username or password", "token": None}
