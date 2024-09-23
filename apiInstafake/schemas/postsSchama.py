from pydantic import BaseModel

class GuardarPosts(BaseModel):
    image:str
    caption:str

class PostsTable(GuardarPosts):
    user_id:int