import requests
import os

url = "http://localhost:8000/api/v1/imports/contracts"
file_path = "backend/test_contract_data.csv"

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    exit(1)

with open(file_path, "rb") as f:
    files = {"file": ("test_contract_data.csv", f, "text/csv")}
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request Error: {e}")
