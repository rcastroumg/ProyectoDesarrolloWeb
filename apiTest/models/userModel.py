from repositories.mysql.mysql_db import MySqldb

class UserModel:
    def getUser(email):
        query = f"Select id, username, email from Users where email = '{email}'"

        ret = MySqldb().execute_query(query)

        return ret