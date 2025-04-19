tables = {
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
