import os
import httpx
from dotenv import load_dotenv
import time
import json
import traceback
from datetime import datetime

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
# Choose a voice ID from ElevenLabs' voice library
VOICE_ID = "XW70ikSsadUbinwLMZ5w" # Example voice 



async def text_to_speech(text: str):
    """
    Calls the ElevenLabs API to convert text to speech.
    Returns the audio content as bytes.
    Includes detailed logs for debugging and reliability.
    """
    if not text or not isinstance(text, str):
        print(f"[{datetime.utcnow()}] ❌ text_to_speech() - Invalid input text: {text}")
        return None

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",  # or 'eleven_turbo_v2_5' for lower latency
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    print(f"\n[{datetime.utcnow()}] 🎙️ text_to_speech() called")
    print(f"  ▶️ Text length: {len(text)} characters")
    print(f"  ▶️ Using voice ID: {VOICE_ID}")
    print(f"  ▶️ Model: {data['model_id']}")
    print(f"  ▶️ Endpoint: {url}")

    start_time = time.time()

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=data)

        duration = round(time.time() - start_time, 2)

        # Log status and timing
        print(f"  ⏱️ API call completed in {duration}s")
        print(f"  📡 Response status: {response.status_code}")

        # Raise if status is not OK
        response.raise_for_status()

        # Log headers
        content_type = response.headers.get("Content-Type", "unknown")
        content_length = response.headers.get("Content-Length", "unknown")
        print(f"  📦 Content-Type: {content_type}")
        print(f"  🔊 Audio size: {content_length} bytes")

        # Optionally save file locally (for debugging)
        debug_audio_path = "debug_tts_output.mp3"
        with open(debug_audio_path, "wb") as f:
            f.write(response.content)
        print(f"  💾 Audio written to {debug_audio_path}")

        print(f"[{datetime.utcnow()}] ✅ text_to_speech() completed successfully\n")

        return response.content

    except httpx.RequestError as e:
        print(f"[{datetime.utcnow()}] 🚨 Network error contacting ElevenLabs API:")
        print(f"  URL: {url}")
        print(f"  Error: {e}")
        print(traceback.format_exc())

    except httpx.HTTPStatusError as e:
        print(f"[{datetime.utcnow()}] ⚠️ ElevenLabs returned HTTP error {e.response.status_code}")
        try:
            error_json = e.response.json()
            print(f"  🔍 Error body: {json.dumps(error_json, indent=2)}")
        except Exception:
            print(f"  ⚠️ Non-JSON error response: {e.response.text}")
        print(traceback.format_exc())

    except Exception as e:
        print(f"[{datetime.utcnow()}] ❌ Unexpected error in text_to_speech()")
        print(f"  Error: {e}")
        print(traceback.format_exc())

    print(f"[{datetime.utcnow()}] ❗ Returning None due to error\n")
    return None