from ninja import Schema

class UserSchema(Schema):
    email: str 
    password: str