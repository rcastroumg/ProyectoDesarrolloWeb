from repositories.mysql.mysql_db import MySqldb

class UserModel:
    def getUser(email):
        query = f"Select id, username, email from Users where email = '{email}'"

        ret = MySqldb().execute_query(query)

        return ret
    

    def getPosts(userid):
        query = f"select id, image, caption from Posts where user_id = {userid}"
        ret = MySqldb().execute_query(query)
        return ret
    
    def getFollowers(userid):
        query = f"select follower_id from Followers where following_id = {userid}"
        ret = MySqldb().execute_query(query)
        return ret

    def getFollowing(userid):
        query = f"select following_id from Followers where follower_id = {userid}"
        ret = MySqldb().execute_query(query)
        return ret