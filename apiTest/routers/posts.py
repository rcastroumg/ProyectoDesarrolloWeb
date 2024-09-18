from fastapi import APIRouter, Depends, HTTPException, status
from schemas.postsSchama import GuardarPosts,PostsTable
from schemas.userSchema import User
from models.postsModel import PostsModel
from utils.userUtil import get_current_user

router = APIRouter(
    prefix="/Posts",
    tags=["Posts"]
)


@router.post("/save")
async def savePost(model:GuardarPosts,current_user: User = Depends(get_current_user)):
    IDPost:int = 0
    try:
        rutaUser = current_user.email.split("@")[0].lower()
        pmodel = PostsTable(
            image=f"https://desarrolloweb.s3.amazonaws.com/{rutaUser}/{model.image}.png",
            caption=model.caption,
            user_id=current_user.id
        )
        IDPost = PostsModel.guardarPost(pmodel)
        return IDPost
    except:
        return HTTPException(status.HTTP_400_BAD_REQUEST,detail="No se pudo guardar el archivo")