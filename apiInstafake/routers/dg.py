import base64
from fastapi import APIRouter, Depends, HTTPException, status

from schemas.dgSchema import GuardarArchivo
from schemas.userSchema import User
from utils.dgUtil import DgUtil
from utils.userUtil import get_current_user

router = APIRouter(
    prefix="/Files",
    tags=["Files"]
)

@router.post("/save")
async def saveFile(model:GuardarArchivo,current_user: User = Depends(get_current_user)):
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

        IDArchivo = DgUtil.guardarArcihvo(NombreArchivo=model.NombreArchivo, TipoContenido=model.TipoContenido, Contenido=content, Usuario=current_user)
        return IDArchivo
    except Exception as ex:
        return HTTPException(status.HTTP_400_BAD_REQUEST,detail=f"No se pudo guardar el archivo: {ex}")