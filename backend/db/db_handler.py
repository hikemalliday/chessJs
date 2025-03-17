import sqlite3
import json



# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect("game.db")
cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS game_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activePlayer TEXT NOT NULL,
    gameState TEXT NOT NULL
);
""")

# Commit and close connection
conn.commit()
conn.close()

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
        self.conn = sqlite3.connect("game.db")
        self.cursor = conn.cursor()

    def create_tables(self):
        try:
            for table in self.tables:
                self.cursor.execute(table)
                conn.commit()
        except Exception as e:
            print(f"ERROR: Could not create table: {e}")
        finally:
            self.conn.close()


