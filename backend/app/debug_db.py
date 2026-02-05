import pg8000.native

def test_connection():
    print("Testing connection with pg8000...")
    try:
        # User credentials from .env
        print(f"Connecting to: user=postgres, password=Jero2009$, db=ikusi_service_db")
        con = pg8000.native.Connection(
            user="postgres",
            password="Jero2009$",
            host="localhost",
            port=5432,
            database="ikusi_service_db"
        )
        print("SUCCESS! Connection established.")
        conn.close()
    except Exception as e:
        print("CONNECTION FAILED.")
        try:
            print(f"Error: {e}")
        except:
            print(f"Error (raw bytes): {str(e).encode('utf-8', 'ignore')}")

if __name__ == "__main__":
    test_connection()
