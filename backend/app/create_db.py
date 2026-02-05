import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

os.environ["PGCLIENTENCODING"] = "latin1"

def create_database(passw):
    print(f"Attempting to connect with password='{passw}'...")
    try:
        con = psycopg2.connect(dbname='postgres', user='postgres', host='localhost', password=passw)
        print("Connected successfully!")
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'ikusi_service_db'")
        if not cur.fetchone():
            print("Creating database ikusi_service_db...")
            cur.execute('CREATE DATABASE ikusi_service_db')
        else:
            print("Database ikusi_service_db already exists.")
            
        cur.close()
        con.close()
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False

if __name__ == "__main__":
    if not create_database('postgres'): # Try 'postgres'
        print("Retrying with 'admin'...")
        create_database('admin')
