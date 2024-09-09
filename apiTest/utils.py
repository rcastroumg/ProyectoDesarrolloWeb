import jwt
import os
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from models import UserInDB, fake_users_db
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from dotenv import load_dotenv

load_dotenv()


SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))


# Contexto de seguridad para manejar el hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Funciones auxiliares para obtener usuarios y verificar contraseñas
def verify_password(plain_password, hashed_password):
    print(plain_password)
    print(hashed_password)
    print(pwd_context.verify(plain_password, hashed_password))
    print(pwd_context.encrypt("password"))
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# Crear el token JWT
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    print(ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Obtener usuario actual usando JWT
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        #print("aqui va")
        print(payload)
        exptime = payload.get("exp")
        print(datetime.utcnow()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        #print(datetime.strptime(str(exptime), "%H:%M:%S"))
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username)
    if user is None:
        raise credentials_exception
    return user