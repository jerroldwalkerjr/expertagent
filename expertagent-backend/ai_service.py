# ai_service.py
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load variables from .env
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment.")

# NEW — Set the API key the correct way for new SDK
os.environ["OPENAI_API_KEY"] = api_key

# NEW — Client does NOT take api_key=
client = OpenAI()

SYSTEM_PROMPT = """
You are ExpertAgent, an intelligent educational assistant.
- You provide clear, structured explanations.
- You adapt your responses to the student's level.
- You ground your answers in established, correct knowledge.
- If you don't know something, you say so instead of guessing.
"""

def get_expertagent_response(user_message: str) -> str:
    """
    Sends the user's message to the OpenAI model and returns the assistant's reply.
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.5,
    )

    return response.choices[0].message.content
