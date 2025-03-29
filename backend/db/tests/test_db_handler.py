import pytest
import sqlite3
from backend.db.db_handler import DbHandler


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
    yield db
    db.conn.close()


class TestDbHandler:
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
