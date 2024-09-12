from pydantic import BaseModel

class GuardarArchivo(BaseModel):
    NombreArchivo:str
    TipoContenido:str
    Contenido:bytes



class FileTable(BaseModel):
    file_name: str
    size: int
    type_content:str
    route:str
    ext:str
    user_id:int