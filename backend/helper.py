import jwt
import datetime

def create_jwt(payload, secret):
    payload["exp"] = datetime.datetime.now() + datetime.timedelta(minutes=1)
    return jwt.encode(payload, secret, "HS256")

def decode_jwt(token, secret):
    try:
        return jwt.decode(token, secret, ["HS256"])
    except jwt.ExpiredSignatureError as e:
        return {"error": f"Token has expired: {e}"}
    except jwt.InvalidTokenError as e:
        return {"error": f"Invalid token: {e}"}
    
    