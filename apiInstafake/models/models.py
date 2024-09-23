from pydantic import BaseModel

# Modelo de datos para usuario
class User(BaseModel):
    username: str
    full_name: str
    email: str
    disabled: bool

class UserInDB(User):
    hashed_password: str



# Simulación de base de datos
fake_users_db = {
    "usuario": {
        "username": "usuario",
        "full_name": "Nombre de Usuario",
        "email": "usuario@example.com",
        "hashed_password": "$2b$12$9tTmIeaibVQ3fd72djWdbeY8xp/H996ksL2PbVT/QwWQ8Y5IRP.Ua",  # Contraseña: "password"
        "disabled": False,
    }
}