from repositories.mysql.mysql_db import MySqldb
from schemas.postsSchama import PostsTable

class PostsModel:

    def guardarPost(model: PostsTable):
        params = [
            {"nombre":"user_id","valor":model.user_id,},
            {"nombre":"image","valor":model.image,},            
            {"nombre":"caption","valor":model.caption,},
        ]
        query = f"""
insert into Posts
(
    user_id,
    image,
    caption
)
values
(%s,%s,%s)
"""
        ret = MySqldb().execute_insert(query,params=params)
        
        return ret
    

    def obtenerTodosPosts():
        query = f"""
select a.user_id, b.username, a.id, a.image, a.caption 
from Posts a
join Users b on a.user_id = b.id
order by a.created_at desc
"""
        ret = MySqldb().execute_query(query)
        return ret
    