import requests
import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

def generate_embedding(text: str) -> list[float]:
    url = f"{OLLAMA_BASE_URL}/api/embeddings"
    payload = {
        "model": OLLAMA_EMBED_MODEL,
        "prompt": text
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json().get("embedding", [])
    except requests.exceptions.RequestException as e:
        print(f"Error generating embedding via Ollama: {e}")
        return []
