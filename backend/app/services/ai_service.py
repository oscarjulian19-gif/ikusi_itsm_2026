import google.generativeai as genai
from app.core.config import get_settings

settings = get_settings()

class GeminiService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel(settings.MODEL_NAME)
        else:
            print("WARNING: No Google API Key found. AI Service will be mocked.")
            self.model = None

    async def generate_response(self, prompt: str):
        if not self.model:
            return "Simulated AI Response: API Key Missing."
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI Error: {str(e)}"

    async def analyze_ticket(self, title: str, description: str, context_docs: list[str] = []):
        if not self.model:
             return "Simulated AI Analysis (No API Key): Please configure GOOGLE_API_KEY."
             
        # ... existing logic ...
        # For P7M6 we will use generate_response directly from the router to have full control.
        # But keeping this for the legacy /analyze_ticket endpoint if used.
        
        context_block = "\n".join(context_docs)
        prompt = f"""
        Act as an Expert IT Service Desk AI (IKUSI Flash 2.0).
        Analyze the following incident ticket and provide immediate heuristics.
        
        Ticket Title: {title}
        Description: {description}
        
        Reference Knowledge (RAG):
        {context_block}
        
        Output format: Limit to 3 bullet points. 
        1. Diagnosis
        2. Suggested Action
        3. Priority Assessment
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI Error: {str(e)}"

    async def generate_embedding(self, text: str):
        if not self.model:
            return [0.0] * 768
        # Use embedding model
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document",
            title="Ticket Embedding"
        )
        return result['embedding']
