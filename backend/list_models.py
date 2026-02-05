import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    # Try hardcoded if env fails (just for test) - user provided one in .env earlier
    # But better to read from .env
    pass

print(f"Using Key: {api_key[:5]}...{api_key[-4:] if api_key else 'None'}")

if api_key:
    genai.configure(api_key=api_key)
    print("Listing available models...")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
else:
    print("No API Key found.")
