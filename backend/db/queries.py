queries = {
    # Refactor the names of these
    # Can probably remove this, we are switching to uuid system
    "get_user_id_from_uuid": """SELECT (id) FROM users WHERE uuid = ?""",
    # I dont understand this query, white and black are not fields
    # "get_game_state": """SELECT activePlayer, gameState, game FROM game_state WHERE white = ? OR black = ? ORDER BY id DESC LIMIT 1""",
    "get_game_state": """SELECT * FROM game_state where game = (SELECT id FROM game WHERE uuid = ?)""",
    "get_games": """SELECT * FROM game""",
    "get_game_from_id": """SELECT * FROM game WHERE id = ?""",
    "get_user_id_from_uuid": """SELECT id FROM users WHERE uuid = ?""",
    "post_signup": """INSERT INTO users (username, hashed_password, uuid) VALUES (?, ?, ?)""",
    "post_login": """SELECT hashed_password, uuid FROM users WHERE username = ? LIMIT 1""",
    "post_game_state": """INSERT INTO game_state (activePlayer, gameState, game) VALUES (?, ?, ?)""",
    "post_create_game": """INSERT INTO game (white, uuid) VALUES (?, ?)""",
    "insert_starting_game_state": """INSERT INTO game_state (activePlayer, gameState, game) VALUES (?, ?, ?)""",
    # Consider making a mock slew of queries for usage only in the test file
    # The actual insert game query should only have (white)
    # We will need a patch for game
    "insert_mock_game": """INSERT INTO game (white, black, uuid) VALUES (?, ?, ?)""",
}
