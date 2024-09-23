import base64
from fastapi import APIRouter, UploadFile

router = APIRouter(
    prefix='/tmp',
    tags=['TMP'],
) 

@router.post('/FileDetail')
async def uploadFile(Archivo:UploadFile):
    FileName = Archivo.filename
    ContentType = Archivo.content_type
    Content = await Archivo.read()
    Content_b64 = base64.b64encode(Content)

    return {"filename":FileName,"ContentType":ContentType,"Content":Content_b64}
