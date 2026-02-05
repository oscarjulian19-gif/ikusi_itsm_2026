import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

models_to_test = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-flash-latest" 
]

for m_name in models_to_test:
    print(f"\nAttempting '{m_name}'...")
    try:
        model = genai.GenerativeModel(m_name)
        response = model.generate_content("Hello")
        print(f"SUCCESS: {m_name}")
    except Exception as e:
        print(f"FAILED {m_name}: {e}")
