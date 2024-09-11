import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime, timedelta
from models.userModel import UserModel
from schemas.userSchema import User
from dotenv import load_dotenv

load_dotenv()


SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv('ACCESS_TOKEN_EXPIRE_DAYS'))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(username: str):
    db = UserModel.getUser(username)
    #if username in db:
    #    print(username)   
    #    user_dict = db[username]
    #    return User(**user_dict)
    if len(db) > 0:
        return User(**db[0])

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    return user

# Crear el token JWT
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    print(ACCESS_TOKEN_EXPIRE_DAYS)
    expires_delta = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Obtener usuario actual usando JWT
async def get_current_user(token: str = Depends(oauth2_scheme)):
    print("llego")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(username)
    if user is None:
        raise credentials_exception
    return user