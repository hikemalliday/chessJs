import os
import sqlite3
import pytest
from uuid import uuid4
from dotenv import load_dotenv
from db.queries import queries
from backend.db.db_handler import DbHandler
from backend.db.helpers import _post_login_response


load_dotenv()

# Dont think these are needed anymore
@pytest.fixture
def mock_validators(mocker):
    mocker.patch("backend.db.validators.post_refresh", lambda payload: None)
    mocker.patch("backend.db.validators.post_login", lambda payload: None)
    mocker.patch("backend.db.validators.post_game_state", lambda payload: None)

@pytest.fixture
def valid_game_state():
    yield [[None for _ in range(8)] for _ in range(8)]

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
    yield {"id": user[0], "username": user[1], "password": user[2], "uuid": user[3]}
    db.conn.close()

@pytest.fixture
def access_token(user):
    yield _post_login_response(user["uuid"], os.getenv("SECRET", None))["access"]