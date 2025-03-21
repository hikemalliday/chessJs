import sqlite3
import json
from db.mock_data import mock_game_state

class DbHandler():

    game_state_table = """
CREATE TABLE IF NOT EXISTS game_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activePlayer TEXT NOT NULL,
    gameState TEXT NOT NULL
);
"""

    tables = [game_state_table]

    def __init__(self):
        self.conn = sqlite3.connect("game.db", check_same_thread=False)
        self.cursor = self.conn.cursor()

    def create_tables(self):
        try:
            for table in self.tables:
                self.cursor.execute(table)
                self.conn.commit()
        except Exception as e:
            print(f"ERROR: Could not create table: {e}")
    
    def insert_mock_data(self):
        insert_query = """
    INSERT INTO game_state (activePlayer, gameState) VALUES (?, ?)
"""
        values = ("black", json.dumps(mock_game_state))
        self.cursor.execute(insert_query, values)
        self.conn.commit()

    def get_game_state(self):
        self.cursor.execute("SELECT * FROM game_state ORDER BY id DESC LIMIT 1")
        row = self.cursor.fetchone()
        if not row:
            return []
        print(row)
        return {"activePlayer": row[1], "gameState": row[2]}




