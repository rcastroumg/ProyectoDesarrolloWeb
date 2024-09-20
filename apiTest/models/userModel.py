from repositories.mysql.mysql_db import MySqldb

class UserModel:
    def getUser(email):
        query = f"Select id, username, email from Users where email = '{email}'"

        ret = MySqldb().execute_query(query)

        return ret
    

    def getUserById(id):
        query = f"Select id, username, email from Users where id = '{id}'"

        ret = MySqldb().execute_query(query)

        return ret
    

    def createUser(email, name):
        params = [
            {"nombre":"email","valor":email,},            
            {"nombre":"username","valor":name,},
        ]
        query = f"""
insert into Users
(
    email,
    username
)
values
(%s,%s)
"""
        ret = MySqldb().execute_insert(query,params=params)
        return ret

    def getPosts(userid):
        query = f"select id, image, caption from Posts where user_id = {userid}"
        ret = MySqldb().execute_query(query)
        return ret
    
    def getFollowers(userid):
        query = f"select a.follower_id,b.username,b.profile_picture from Followers a join Users b on a.follower_id = b.id where a.following_id = {userid}"
        #query = f"select follower_id from Followers where following_id = {userid}"
        ret = MySqldb().execute_query(query)
        return ret

    def getFollowing(userid):
        query = f"select a.following_id,b.username,b.profile_picture from Followers a join Users b on a.following_id = b.id where a.follower_id = {userid}"
        ret = MySqldb().execute_query(query)
        return ret
    
    def getToFollowing(userid):
        query = f"""
select 
    id, 
    username 
from Users 
where id not in (
    select a.following_id 
    from Followers a  
    where a.follower_id = {userid})
and id <> {userid}"""        
        ret = MySqldb().execute_query(query)
        return ret
        

    def follow(userid,useridFollow):
        params = [
            {"nombre":"follower_id","valor":userid,},            
            {"nombre":"following_id","valor":useridFollow,},
        ]
        query = f"""
insert into Followers
(
    follower_id,
    following_id
)
values
(%s,%s)
"""
        ret = MySqldb().execute_insert(query,params=params)
        return ret
    
    
    def unfollow(userid,useridFollow):        
        query = f"""
delete from Followers
where follower_id = {userid} 
and following_id = {useridFollow}
"""
        ret = MySqldb().execute_query(query)
        return ret