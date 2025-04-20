from uuid import uuid4
import pytest
import sqlite3
from backend.db.db_handler import DbHandler
import json
from db.queries import queries

# Dont think these are needed anymore
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

@pytest.fixture
def user(db_handler):
    user_uuid = str(uuid4())
    db = db_handler
    db.cursor.execute(queries["post_signup"], ("test-user", "test-pass", user_uuid))
    db.conn.commit()
    user = db.cursor.execute(queries["get_user_from_uuid"], (user_uuid,)).fetchone()
    yield {"id": user[0], "username": user[1], "passowrd": user[2], "uuid": user[3]}

@pytest.fixture
def valid_game_state():
    yield [[None for _ in range(8)] for _ in range(8)]


class TestDbHandler:

    def test_create_tables(self, db_handler):
        for table_name in db_handler.tables.keys():
            db_handler.cursor.execute(
                f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'"
            )
            assert (
                db_handler.cursor.fetchone() is not None
            ), f"Table {table_name} was not created"


    def test_post_game_state(self, db_handler, user, valid_game_state):
        db = db_handler
        game_response = db.post_create_game({"uuid": user["uuid"]})
        payload = {
            "activePlayer": "white",
            "gameState": valid_game_state,
            "uuid": game_response["uuid"],
        }
        response = db_handler.post_game_state(payload)
        assert response["message"] == "Successfully inserted into 'game_state' table."


    def test_post_signup(self, db_handler):
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


    def test_post_create_game(self, db_handler, user):
        db = db_handler
        game = db.post_create_game({"uuid": user["uuid"]})
        assert int(game["white"]) == user["id"]


    def test_get_game_state(self, db_handler, user, valid_game_state):
        db = db_handler
        game_response = db.post_create_game({"uuid": user["uuid"]})
        db.cursor.execute(
            queries["insert_starting_game_state"],
            ("white", json.dumps(valid_game_state), 1),
        )
        game_state = db.get_game_state(uuid=game_response["uuid"])
        assert game_state["game"] == game_response["id"]


    def test_get_games(self, db_handler, user):
        db = db_handler
        game_response = db.post_create_game({"uuid": user["uuid"]})
        games = db.get_games({"is_started": 0})
        assert game_response["uuid"] == games[0]["uuid"]
