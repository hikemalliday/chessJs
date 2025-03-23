def post_refresh(payload):
    if (
        not isinstance(payload, dict)
        or not (len(payload.keys()) == 1)
        or not "refresh" in payload
    ):
        raise ValueError("Invalid post_refresh payload.")

def post_login(payload):
    if (
        not isinstance(payload, dict)
        or not (len(payload.keys()) == 2)
        or not "username" in payload
        or not "password" in payload
    ):
        raise ValueError("Invalid post_login payload.")

def post_signup(payload):
    if (
        not isinstance(payload, dict)
        or not (len(payload.keys()) == 2)
        or not "username" in payload
        or not "password" in payload
    ):
        raise ValueError("Invalid post_signup payload.") 


def post_game_state(payload):
    if (
        not isinstance(payload, dict)
        or not (len(payload.keys()) == 2)
        or not "activePlayer" in payload
        or not "gameState" in payload
    ):
        raise ValueError("Invalid post_game_state payload.")



    


