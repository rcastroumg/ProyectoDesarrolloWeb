from repositories.mysql.mysql_db import MySqldb
from schemas.dgSchema import FileTable

class FilesModel:

    def guardarArchivo(model: FileTable):
        params = [
            {"nombre":"file_name","valor":model.file_name,},            
            {"nombre":"size","valor":model.size,},
            {"nombre":"type_content","valor":model.type_content,},
            {"nombre":"route","valor":model.route,},
            {"nombre":"ext","valor":model.ext,},
            {"nombre":"user_id","valor":model.user_id,}
        ]
        query = f"""
insert into Files
(
    file_name,
    size,
    type_content,
    route,
    ext,
    user_id
)
values
(%s,%s,%s,%s,%s,%s)
"""
        ret = MySqldb().execute_insert(query,params=params)
        
        return ret
    

    def getLastFile():
        query = f"select * from Files order by created_at desc limit 1"
        ret = MySqldb().execute_query(query)
        return ret