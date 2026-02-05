import pg8000.native

def create_database():
    print("Connecting to 'postgres' database to create 'ikusi_service_db'...")
    try:
        # Connect to system 'postgres' db
        con = pg8000.native.Connection(
            user="postgres",
            password="Jero2009$",
            host="localhost",
            port=5432,
            database="postgres"
        )
        
        # Check if db exists
        # pg8000 doesn't support easy params in run for identifiers, so be careful
        results = con.run("SELECT 1 FROM pg_database WHERE datname = 'ikusi_service_db'")
        
        if not results:
            print("Creating database ikusi_service_db...")
            # We must be in autocommit mode for CREATE DATABASE, 
            # pg8000 native runs in autocommit by default if no transaction started? 
            # Actually pg8000 native interface is autocommit by default.
            con.run("CREATE DATABASE ikusi_service_db")
            print("Database created successfully!")
        else:
            print("Database already exists.")
            
        con.close()
        return True
    except Exception as e:
        print(f"Failed to create database: {e}")
        return False

if __name__ == "__main__":
    create_database()
