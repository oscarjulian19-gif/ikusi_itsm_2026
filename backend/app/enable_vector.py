import pg8000.native

def enable_vector_extension():
    print("Enabling 'vector' extension in 'ikusi_service_db'...")
    try:
        con = pg8000.native.Connection(
            user="postgres",
            password="Jero2009$",
            host="localhost",
            port=5432,
            database="ikusi_service_db"
        )
        
        con.run("CREATE EXTENSION IF NOT EXISTS vector")
        print("Extension 'vector' enabled successfully!")
        con.close()
    except Exception as e:
        print(f"Failed to enable extension: {e}")

if __name__ == "__main__":
    enable_vector_extension()
