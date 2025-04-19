class Serializer:
    def __init__(self, query_response=None, many=False):
        self.class_name = "Serializer"
        self.query_response = query_response
        self.data = []
        self.fields = []
        self.many = many

    def serialize_data(self):
        try:
            if not self.many:
                response = {k: v for k, v in zip(self.fields, self.query_response)}
                return response
            for row in self.query_response:
                serialized_dict = {}
                for field, key in zip(row, self.fields):
                    serialized_dict[key] = field
                self.data.append(serialized_dict)
            return self.data
        except ValueError as e:
            raise ValueError(f"{self.class_name}.serialize_data: {e}") from e
        except Exception as e:
            raise Exception(f"{self.class_name}: unexpected error: {e}") from e


class GameStateSerializer(Serializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields = ["id", "activePlayer", "gameState", "game"]
        self.class_name = "GameStateSerializer"


class GameSerializer(Serializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields = ["id", "white", "black", "is_started", "uuid"]
        self.class_name = "GameSerializer"


class UsersSerializer(Serializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields = ["id", "username", "hashed_password", "uuid"]
        self.class_name = "UserSerializer"
