import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("Attempting to generate with 'gemini-1.5-flash'...")
try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Hello, can you hear me?")
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Failed with 'gemini-1.5-flash': {e}")

print("\nAttempting to generate with 'models/gemini-1.5-flash'...")
try:
    model = genai.GenerativeModel("models/gemini-1.5-flash")
    response = model.generate_content("Hello, can you hear me?")
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Failed with 'models/gemini-1.5-flash': {e}")
    
print("\nAttempting to generate with 'gemini-1.5-flash-latest'...")
try:
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    response = model.generate_content("Hello, can you hear me?")
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Failed with 'gemini-1.5-flash-latest': {e}")
