import requests
import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "qwen2.5:7b")

def generate_chat_response(prompt: str, context_chunks: list) -> dict:
    url = f"{OLLAMA_BASE_URL}/api/generate"

    # Format the context strictly and safely
    context_text = ""
    source_pages = set()

    for idx, chunk in enumerate(context_chunks):
        page_no = chunk.get('metadata', {}).get('page_number', 'Unknown')
        context_text += f"\n[Document Chunk {idx+1} | Source Page: {page_no}]:\n{chunk.get('text', '')}\n"
        if page_no != 'Unknown':
            source_pages.add(int(page_no))

    system_prompt = """You are a highly accurate NEET-PG tutor.
IMPORTANT RULES:
1. You MUST answer the user's question using ONLY the provided Document Chunks.
2. You MUST cite the Source Page number for every fact you provide.
3. If the answer is not found in the chunks, say: 'This was not found in the uploaded PDF.'
4. DO NOT hallucinate medical advice."""

    full_prompt = f"{system_prompt}\n\n{context_text}\n\nUser Question:\n{prompt}"

    payload = {
        "model": OLLAMA_CHAT_MODEL,
        "prompt": full_prompt,
        "stream": False
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        content = response.json().get("response", "")

        return {
            "content": content,
            "sourcePages": list(source_pages),
            "needsReview": False
        }
    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama: {e}")
        return {
            "content": "Local AI is currently unavailable or Ollama is not running. Please check your setup.",
            "sourcePages": [],
            "needsReview": True
        }
