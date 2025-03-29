import jwt
import datetime
import bcrypt


def create_jwt(payload, secret, **kwargs):
    valid_keys = {
        "days",
        "seconds",
        "microseconds",
        "milliseconds",
        "minutes",
        "hours",
        "weeks",
    }
    filtered_kwargs = {k: v for k, v in kwargs.items() if k in valid_keys}
    payload["exp"] = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        **filtered_kwargs
    )
    return jwt.encode(payload, secret, "HS256")


def decode_jwt(token, secret):
    try:
        return jwt.decode(token, secret, ["HS256"])
    except jwt.ExpiredSignatureError as e:
        return {"error": f"Token has expired: {e}"}
    except jwt.InvalidTokenError as e:
        return {"error": f"Invalid token: {e}"}


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password.decode("utf-8")
