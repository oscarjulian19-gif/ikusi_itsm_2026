import requests
import sys

def check_health():
    try:
        r = requests.get("http://localhost:8000/docs", timeout=2)
        print(f"Docs status: {r.status_code}")
    except Exception as e:
        print(f"Docs unreachable: {e}")

def check_contract(cid):
    try:
        r = requests.get(f"http://localhost:8000/api/v1/contracts/{cid}", timeout=5)
        print(f"Contract {cid}: {r.status_code}")
        if r.status_code == 200:
            print(r.json())
        else:
            print(r.text)
    except Exception as e:
        print(f"Contract fetch failed: {e}")

if __name__ == "__main__":
    check_health()
    check_contract("CNTR2600120")
