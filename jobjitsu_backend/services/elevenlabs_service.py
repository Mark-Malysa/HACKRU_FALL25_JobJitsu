import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
# Choose a voice ID from ElevenLabs' voice library
VOICE_ID = "XW70ikSsadUbinwLMZ5w" # Example voice 



async def text_to_speech(text: str):
    """
    Calls the ElevenLabs API to convert text to speech.
    Returns the audio content as bytes.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2", # Or use 'eleven_turbo_v2_5' for low latency
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
        response.raise_for_status() # Raise an exception for bad status codes
        return response.content