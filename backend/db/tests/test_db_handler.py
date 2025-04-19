from uuid import uuid4
import pytest
import sqlite3
from backend.db.db_handler import DbHandler
import json


@pytest.fixture
def mock_validators(mocker):
    mocker.patch("backend.db.validators.post_refresh", lambda payload: None)
    mocker.patch("backend.db.validators.post_login", lambda payload: None)
    mocker.patch("backend.db.validators.post_game_state", lambda payload: None)


@pytest.fixture
def db_handler(tmp_path):
    db = DbHandler()
    db.conn = sqlite3.connect(":memory:", check_same_thread=False)
    db.cursor = db.conn.cursor()
    db.create_tables()
    db.cursor.execute(
        """INSERT INTO users (username, hashed_password, uuid) VALUES (?, ?, ?)""",
        ("mock-user", "mock-pw", str(uuid4())),
    )
    yield db
    db.conn.close()


class TestDbHandler:
    VALID_GAME_STATE = [
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
    ]

    mock_queries = {
        "insert_mock_game": """INSERT INTO game (white, uuid) VALUES (?, ?)""",
        "insert_starting_game_state": """INSERT INTO game_state (activePlayer, gameState, game) VALUES (?, ?, ?)""",
        "get_uuid_from_user_id": """SELECT (uuid) FROM users WHERE id = ?""",
    }

    def test_create_tables(self, db_handler):
        for table_name in db_handler.tables.keys():
            db_handler.cursor.execute(
                f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'"
            )
            assert (
                db_handler.cursor.fetchone() is not None
            ), f"Table {table_name} was not created"

    def test_post_game_state(self, db_handler):
        payload = {
            "activePlayer": "white",
            "gameState": [[None for _ in range(8)] for _ in range(8)],
            "game": 1,
        }
        response = db_handler.post_game_state(payload)
        assert response["message"] == "Successfully inserted into 'game_state' table."

    def test_post_signup(self, db_handler, mock_validators):
        payload = {"username": "test-user", "password": "test-password"}
        response = db_handler.post_signup(payload)
        assert response["message"] == "Account created successfully."
        assert "access" in response
        assert "refresh" in response

        db_handler.cursor.execute(
            "SELECT username, hashed_password FROM users WHERE username = ?",
            ("test-user",),
        )
        result = db_handler.cursor.fetchone()
        assert result[0] == "test-user"

    def test_post_login(self, db_handler):
        payload = {"username": "test-user", "password": "test-password"}
        db_handler.post_signup(payload)
        response = db_handler.post_login(payload)
        assert response["message"] == "Login successful"
        assert "refresh" in response
        assert "access" in response

    def test_post_create_game(self, db_handler):
        db = db_handler
        uuid = str((uuid4()))
        db.post_create_game({}, uuid=uuid)

    # Consider having the post return a regular response via serializer
    def test_get_game_state(self, db_handler):
        db = db_handler
        uuid = str(uuid4())
        game_response = db.post_create_game({}, uuid=uuid)
        db.cursor.execute(
            self.mock_queries["insert_starting_game_state"],
            ("white", json.dumps(self.VALID_GAME_STATE), 1),
        )
        game_state = db.get_game_state(uuid=game_response["uuid"])
        assert game_state["game"] == game_response["id"]

    def test_get_games(self, db_handler):
        db = db_handler
        uuid = str(uuid4())
        game_response = db.post_create_game({}, uuid=uuid)
        games = db.get_games({"is_started": 0})
        assert game_response["uuid"] == games[0]["uuid"]
