import responses
import requests
from rest.tests.endpoints import BASE_API_URL #TODO: Handle this in env vars
from rest.tests.mock_responses import MOCK_RESPONSES


class TestGetRequests:

    @responses.activate
    def test_get_game_state(self, access_token):
        uri = f"{BASE_API_URL}game_state"
        responses.add(
            responses.GET,
            uri,
            json=MOCK_RESPONSES["get_game_state"],
        )
        response = requests.get(uri)

