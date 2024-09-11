import base64
from fastapi import APIRouter, Depends, HTTPException, status

from schemas.dgSchema import GuardarArchivo
from utils import dgUtil

router = APIRouter(
    prefix="/Files",
    tags=["Files"]
)

@router.post("/save")
async def saveFile(model:GuardarArchivo):
    IDArchivo:int = 0
    try:
        content:bytes = []
        try:
            #string is UTF-8
            base64_code = model.Contenido.decode("utf-8")
            data = base64_code.encode()
            content = base64.b64decode(data)
        except UnicodeError:
            #string is not UTF-8
            content = model.Contenido

        IDArchivo = dgUtil.guardarArcihvo(NombreArchivo=model.NombreArchivo, TipoContenido=model.TipoContenido, Contenido=content, Usuario=model.Usuario)
        return IDArchivo
    except:
        return HTTPException(status.HTTP_400_BAD_REQUEST,detail="No se pudo guardar el archivo")