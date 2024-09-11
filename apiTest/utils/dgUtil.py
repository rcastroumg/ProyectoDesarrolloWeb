

from fastapi import HTTPException, status


def guardarArcihvo(NombreArchivo:str,TipoContenido:str,Contenido:bytes,Usuario:str):
        tamano_archivo = len(Contenido)
        extencion_archivo = NombreArchivo.split(".").pop().lower()

        if not extencion_archivo:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre del archivo no contiene extension")
        
        ruta = Usuario

        db:PkgDigitalizacion = PkgDigitalizacion()
        try:
            db.begin_transaction()

            IDArchivo:int        
            while True:
                IDArchivo = db.Idarchivonuevo()
                db.Insertararchivo(IDArchivo,NombreArchivo,tamano_archivo,TipoContenido,Usuario,noversion,ruta,extencion_archivo)

                for tag in model.Etiquetas:
                    db.Insertardetallearchivo(IDArchivo,model.Aplicacion,model.Categoria,tag.Etiqueta,tag.Valor)

                # Arma la ruta final segun sistema operativo o almacenamiento
                guardar = dgUtil.guardarArchivoFisico(IDArchivo,ruta,extencion_archivo,Contenido,TipoContenido,NombreArchivo)
                if(guardar == False):
                    raise Exception("Error al guardar archivo")              

                # Etiquetando
                if(model.Aplicacion == "TI" and (model.Categoria == 6 or model.Categoria == 7) and len([a for a in model.Etiquetas if a.Etiqueta == 4]) > 0 and AppDg == True):
                    model.Aplicacion = "SO"
                    model.Categoria = 5
                    model.Etiquetas = [a for a in model.Etiquetas if a.Etiqueta == 4]
                    ruta = db.Rutacategoria(model.Aplicacion,model.Categoria).replace("\\\\","\\")
                else:
                    break

            db.commit_transaction()
            
            return IDArchivo
        except Exception as err:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(err))
        
# Guarda el archivo ya sea local o aws segun la configuracion
    def guardarArchivoFisico(IDArchivo:str, ruta:str, file_ext:str, file_content, file_mime:str, file_name_orig:str):
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
                archivo_ruta = ruta[3:]
                path = archivo_ruta.replace("\\","/")                
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
                s3_client,AWS_BUCKET_NAME = ArchivosUtil.initAws()
                document = s3_client.put_object(
                    Bucket=AWS_BUCKET_NAME,
                    Key=path,
                    Body=file_content,
                ) 
                print(document)

            try:
                # Inicializa redis
                save_redis = SettingsRedis().redis
                if save_redis:
                    redisKey = f"Documento:id:{IDArchivo}"
                    # Guarda archivo en redis
                    carchivo = CArchivo(Contenido=file_content,MIME=file_mime,Nombre=file_name_orig)
                    ArchivosUtil.setRedis(carchivo,redisKey)
            except:
                pass
            
            return True
        except Exception as ex:
            print(ex)
            return False