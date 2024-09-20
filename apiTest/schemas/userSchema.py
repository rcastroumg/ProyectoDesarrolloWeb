from pydantic import BaseModel

class User(BaseModel):
    id: int
    username: str
    email: str
    profile_picture: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


class follow(BaseModel):
    useridFollow:int