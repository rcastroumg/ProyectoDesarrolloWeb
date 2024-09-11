from pydantic import BaseModel

class GuardarArchivo(BaseModel):
    NombreArchivo:str
    TipoContenido:str
    Usuario:str
    Contenido:bytes