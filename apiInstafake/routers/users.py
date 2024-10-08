from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from schemas.userSchema import Token, User, follow
from models.userModel import UserModel
from utils.userUtil import authenticate_user, create_access_token, get_current_user

router = APIRouter(
    prefix="/User",
    tags=["Users"]
)


# Ruta para obtener el token
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(form_data.username)
    print(form_data.password)
    print(form_data.scopes)
    user = authenticate_user(form_data.username, form_data.password," ".join(form_data.scopes))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    #access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
async def register(email:str, username: str):
    idUser = UserModel.createUser(email,username)
    return idUser


@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/mydata")
async def read_users_me(current_user: User = Depends(get_current_user)):
    posts = UserModel.getPosts(current_user.id)
    followers = UserModel.getFollowers(current_user.id)
    following = UserModel.getFollowing(current_user.id)

    data = {
        "posts": posts,
        "followers": followers,
        "following": following
    }
    return data


@router.get("/tofollwing")
async def read_users_me(current_user: User = Depends(get_current_user)):
    following = UserModel.getToFollowing(current_user.id)
    return following


@router.post("/follow")
async def read_users_me(useridFollow:follow, current_user: User = Depends(get_current_user)):
    print(useridFollow)
    ret = UserModel.follow(current_user.id, useridFollow.useridFollow)
    return ret

@router.post("/unfollow")
async def read_users_me(useridFollow:follow, current_user: User = Depends(get_current_user)):
    ret = UserModel.unfollow(current_user.id, useridFollow.useridFollow)
    return ret