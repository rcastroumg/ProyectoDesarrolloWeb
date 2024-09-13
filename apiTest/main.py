from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import uvicorn
import routers

from models.models import User, fake_users_db
from schemas.userSchema import Token

import routers.users
import routers.dg
import routers.tmp
from utils.utils import authenticate_user, create_access_token, get_current_user

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(routers.users.router)
app.include_router (routers.dg.router)
app.include_router (routers.tmp.router)

origins = [
    "http://localhost",
    "http://localhost:8095",
]

app.add_middleware(
    CORSMiddleware,
    #allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Ruta para obtener el token
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    #access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


# Para debug
if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8095)