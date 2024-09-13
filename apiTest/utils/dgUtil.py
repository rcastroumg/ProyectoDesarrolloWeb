

from configparser import ConfigParser
from pathlib import Path
import platform
from fastapi import HTTPException, status
from boto3.session import Session

from models.filesModel import FilesModel
from schemas.dgSchema import FileTable
from schemas.userSchema import User
from utils.settings import Settings

config = ConfigParser()

class DgUtil:

    def initAws():
        config.read(Settings().config_aws)

        AWS_ACCESS_KEY_ID = config.get("aws", "AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = config.get("aws", "AWS_SECRET_ACCESS_KEY")
        AWS_REGION = config.get("aws", "AWS_REGION")
        AWS_BUCKET_NAME = config.get("aws", "AWS_BUCKET_NAME")

        session = Session(
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION,
        )

        s3_client = session.client("s3")

        return [s3_client,AWS_BUCKET_NAME]

    def guardarArcihvo(NombreArchivo:str,TipoContenido:str,Contenido:bytes,Usuario:User):
        tamano_archivo = len(Contenido)
        extencion_archivo = NombreArchivo.split(".").pop().lower()

        if not extencion_archivo:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre del archivo no contiene extension")
        
        ruta = Usuario.email.split("@")[0].lower()

        model = FileTable(
            file_name = NombreArchivo,
            size = tamano_archivo,
            type_content = TipoContenido,
            route = ruta,
            ext = extencion_archivo,
            user_id = Usuario.id
        )


        try:

            IDArchivo:int        

            IDArchivo = FilesModel.guardarArchivo(model)
            
            # Arma la ruta final segun sistema operativo o almacenamiento
            guardar = DgUtil.guardarArchivoFisico(IDArchivo,ruta,extencion_archivo,Contenido)
            if(guardar == False):
                raise Exception("Error al guardar archivo")              

            return IDArchivo
        except Exception as err:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(err))
        
    # Guarda el archivo ya sea local o aws segun la configuracion
    def guardarArchivoFisico(IDArchivo:str, ruta:str, file_ext:str, file_content):
        try:
            aws = Settings().save_aws
            file_name_fisic = str(IDArchivo) + "." + file_ext
            ruta = ruta.lower()
            if((platform.system() == "Darwin" or platform.system() == "Linux") and aws == False):
                archivo_ruta = Settings().main_path + ruta[2:]
                path = archivo_ruta.replace("\\","/")
                path = Path(path)
                path.mkdir(parents=True,exist_ok=True) 
                path = path / file_name_fisic
            elif aws == True:
                path = ruta.replace("\\","/")                
                path = path + "/" + file_name_fisic
            else: 
                path = Path(path)
                path.mkdir(parents=True,exist_ok=True)
                path = ruta / file_name_fisic
                

            if not aws:
                # graba en SO local                             
                with open(path,"wb") as f:
                    f.write(file_content)
            else:
                # graba en AWS
                s3_client,AWS_BUCKET_NAME = DgUtil.initAws()
                document = s3_client.put_object(
                    Bucket=AWS_BUCKET_NAME,
                    Key=path,
                    Body=file_content,
                ) 
                print(document)
            
            return True
        except Exception as ex:
            print(ex)
            return False