import pytest
from backend.db.validators import (
    post_refresh,
    post_login,
    post_signup,
    post_game_state,
    post_create_game,
)
from contextlib import contextmanager

#TODO: Create test functions or classes to remove this duplicated code

@contextmanager
def does_not_raise():
    yield


class TestValidators:
    
    VALID_GAME_STATE = [[None for _ in range(8)] for _ in range(8)]
    INVALID_GAME_STATE_TOP_LEVEL = []
    INVALID_GAME_STATE_CHILD_LEVEL = [[], [], [], [], [], [], [], []]

    def test_post_refresh_valid_payload(self):
        payload = {"refresh": "refresh-token"}
        with does_not_raise():
            post_refresh(payload)

    def test_post_refresh_invalid_payload_not_dict(self):
        payload = ["not_a_dict"]
        with pytest.raises(
            ValueError, match="Invalid post_refresh payload: must be a dict"
        ):
            post_refresh(payload)

    def test_post_refresh_invalid_payload_wrong_key_len(self):
        payload = {"refresh": "refresh-token", "extra_key": None}
        with pytest.raises(
            ValueError, match="Invalid post_refresh payload: invalid amount of keys"
        ):
            post_refresh(payload)

    def test_post_refresh_invalid_payload_no_refresh_key(self):
        payload = {"invalid-key": None}
        with pytest.raises(
            ValueError, match="Invalid post_refresh payload: must contain 'refresh' key"
        ):
            post_refresh(payload)

    # validators.post_login
    def test_post_login_valid_payload(self):
        payload = {"username": "test-username", "password": "test-password"}
        with does_not_raise():
            post_login(payload)

    def test_post_login_invalid_payload_not_dict(self):
        payload = ["not_a_dict"]
        with pytest.raises(
            ValueError, match="Invalid post_login payload: must be a dict"
        ):
            post_login(payload)

    def test_post_login_invalid_payload_wrong_key_len(self):
        payload = {
            "username": "test-username",
            "password": "test-password",
            "extra_key": None,
        }
        with pytest.raises(
            ValueError, match="Invalid post_login payload: invalid amount of keys"
        ):
            post_login(payload)

    def test_post_login_invalid_payload_no_username_key(self):
        payload = {"password": "test-password", "test_key": None}
        with pytest.raises(
            ValueError, match="Invalid post_login payload: must contain 'username' key"
        ):
            post_login(payload)

    def test_post_login_invalid_payload_no_password_key(self):
        payload = {"username": "test-username", "test_key": None}
        with pytest.raises(
            ValueError, match="Invalid post_login payload: must contain 'password' key"
        ):
            post_login(payload)

    # validators.post_login
    def test_post_signup_valid_payload(self):
        payload = {"username": "test-username", "password": "test-password"}
        with does_not_raise():
            post_signup(payload)

    def test_post_signup_invalid_payload_not_dict(self):
        payload = ["not_a_dict"]
        with pytest.raises(
            ValueError, match="Invalid post_signup payload: must be a dict"
        ):
            post_signup(payload)

    def test_post_signup_invalid_payload_wrong_key_len(self):
        payload = {
            "username": "test-username",
            "password": "test-password",
            "extra_key": None,
        }
        with pytest.raises(
            ValueError, match="Invalid post_signup payload: invalid amount of keys"
        ):
            post_signup(payload)

    def test_post_signup_invalid_payload_no_username_key(self):
        payload = {"password": "test-password", "test_key": None}
        with pytest.raises(
            ValueError, match="Invalid post_signup payload: must contain 'username' key"
        ):
            post_signup(payload)

    def test_post_signup_invalid_payload_no_password_key(self):
        payload = {"username": "test-username", "test_key": None}
        with pytest.raises(
            ValueError, match="Invalid post_signup payload: must contain 'password' key"
        ):
            post_signup(payload)

    def test_post_game_state_valid_payload(self):
        payload = {
            "activePlayer": "white",
            "gameState": self.VALID_GAME_STATE,
            "uuid": "test-uuid",
        }
        with does_not_raise():
            post_game_state(payload)

    def test_post_game_state_not_dict(self):
        payload = ["not_a_dict"]
        with pytest.raises(
            ValueError, match="Invalid post_game_state payload: must be a dict"
        ):
            post_game_state(payload)

    def test_post_game_state_wrong_key_len(self):
        payload = {
            "activePlayer": "white",
            "gameState": self.VALID_GAME_STATE,
        }
        with pytest.raises(
            ValueError, match="Invalid post_game_state payload: invalid amount of keys"
        ):
            post_game_state(payload)

    def test_post_game_state_no_activeplayer_key(self):
        payload = {"invalid-key": None, "gameState": self.VALID_GAME_STATE, "game": 1}
        with pytest.raises(
            ValueError,
            match="Invalid post_game_state payload: must contain 'activePlayer' key",
        ):
            post_game_state(payload)

    def test_post_game_state_no_uuid_key(self):
        payload = {
            "invalid-key": None,
            "activePlayer": "white",
            "gameState": self.VALID_GAME_STATE,
        }
        with pytest.raises(
            ValueError,
            match="Invalid post_game_state payload: must contain 'uuid' key",
        ):
            post_game_state(payload)

    def test_post_game_state_invalid_game_state_top_level(self):
        payload = {
            "activePlayer": "white",
            "gameState": self.INVALID_GAME_STATE_TOP_LEVEL,
            "uuid": "test-uuid",
        }
        with pytest.raises(
            ValueError,
            match="Invalid post_game_state payload: 'gameState' must have len == 8",
        ):
            post_game_state(payload)

    def test_post_game_state_invalid_game_state_child_level(self):
        payload = {
            "activePlayer": "white",
            "gameState": self.INVALID_GAME_STATE_CHILD_LEVEL,
            "uuid": "test-uuid",
        }
        with pytest.raises(
            ValueError,
            match="Invalid post_game_state payload: 'gameState' elements must have len == 8",
        ):
            post_game_state(payload)

    def test_post_create_game_not_dict(self):
        payload = ["not_a_dict"]
        with pytest.raises(
            ValueError, match="Invalid post_create_game payload: must be a dict"
        ):
            post_create_game(payload)

    def test_post_create_game_wrong_key_len(self):
        payload = {
            "uuid": "test-uuid",
            "extra-key": "dummy-val",
        }
        with pytest.raises(
            ValueError, match="Invalid post_create_game payload: invalid amount of keys"
        ):
            post_create_game(payload)

    def test_post_create_game_no_uuid_key(self):
        payload = {"wrong-key": "dummy-val"}
        with pytest.raises(
            ValueError,
            match="Invalid post_create_game payload: must contain 'uuid' key",
        ):
            post_create_game(payload)
