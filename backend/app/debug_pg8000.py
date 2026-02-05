import pg8000.native

def test():
    print("Testing pg8000 connection...")
    try:
        con = pg8000.native.Connection(
            user="postgres",
            password="Jero2009$",
            host="localhost",
            port=5432,
            database="ikusi_service_db"
        )
        print("SUCCESS! Connected.")
        con.close()
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test()
