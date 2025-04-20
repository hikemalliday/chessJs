from helper import create_jwt


def _get_query_param_query(query, query_params):
    values = []
    for i, (k, v) in enumerate(query_params.items()):
        if i == 0:
            query += f" WHERE {k} = ?"
        else:
            query += f" AND WHERE {k} = ?"
        values.append(v)
    return query, tuple(values)


def _post_signup_response(uuid, secret):
    return {
        "message": "Account created successfully.",
        "access": create_jwt({"uuid": uuid}, secret, **{"minutes": 120}),
        "refresh": create_jwt({"uuid": uuid}, secret, **{"days": 7}),
    }


def _post_login_response(uuid, secret):
    return {
        "message": "Login successful",
        "access": create_jwt({"uuid": uuid}, secret, **{"minutes": 120}),
        "refresh": create_jwt({"uuid": uuid}, secret, **{"days": 7}),
    }
