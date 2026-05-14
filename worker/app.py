from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import os
import time
import requests

from services.docling_service import extract_pdf_chunks
from services.ocr_service import extract_ocr_from_pdf
from services.rag_service import store_chunk_in_vector_db, retrieve_relevant_chunks
from services.ollama_service import generate_chat_response

app = FastAPI()

NODE_SERVER_URL = os.getenv("NODE_SERVER_URL", "http://localhost:5000/api")

class ProcessDocumentRequest(BaseModel):
    documentId: str
    userId: str
    filePath: str

class ChatRequest(BaseModel):
    documentId: str
    userId: str
    query: str

class TeachRequest(BaseModel):
    documentId: str
    userId: str
    topic: str
    context: str

class MCQRequest(BaseModel):
    documentId: str
    userId: str
    topic: str
    count: int = 5

jobs = {}

def background_process_document(job_id: str, req: ProcessDocumentRequest):
    jobs[job_id] = "processing"

    try:
        # Step 1: Try extracting text using Docling (Selectable Text)
        chunks = extract_pdf_chunks(req.filePath)

        # Step 2: Fallback to OCR if Docling extracted very little (e.g. Scanned PDF)
        if not chunks or len(chunks) == 0:
            print(f"Docling found no text for {req.documentId}, falling back to PaddleOCR...")
            chunks = extract_ocr_from_pdf(req.filePath)

            # If OCR chunks have low confidence, mark them as 'needsReview'
            for chunk in chunks:
                if chunk.get("confidence", 1.0) < 0.8:
                    chunk["needsReview"] = True
                    chunk["source_type"] = "unconfirmedHandwritingOrPoorScan"

        # Step 3: Store chunks in ChromaDB for Retrieval
        for chunk in chunks:
            metadata = {
                "page_number": chunk.get("page_number", 1),
                "topic": chunk.get("topic", ""),
                "source_type": chunk.get("source_type", "selectableText")
            }
            store_chunk_in_vector_db(req.documentId, chunk["text"], metadata)

        # Step 4: Send chunks back to the Node.js server
        webhook_url = f"{NODE_SERVER_URL}/documents/{req.documentId}/chunks"
        payload = {
            "userId": req.userId,
            "chunks": chunks,
            "status": "Ready"
        }

        try:
            response = requests.post(webhook_url, json=payload)
            response.raise_for_status()
        except requests.exceptions.RequestException as weberr:
             print(f"Warning: Failed to update Node backend via webhook: {weberr}")

        jobs[job_id] = "completed"

    except Exception as e:
        print(f"Job {job_id} failed: {e}")
        jobs[job_id] = "failed"
        # Notify Node.js of failure
        try:
             webhook_url = f"{NODE_SERVER_URL}/documents/{req.documentId}/chunks"
             requests.post(webhook_url, json={"userId": req.userId, "chunks": [], "status": "Failed"})
        except Exception:
             pass

@app.post("/worker/process-document")
async def process_document(req: ProcessDocumentRequest, background_tasks: BackgroundTasks):
    job_id = f"job_{int(time.time())}"
    jobs[job_id] = "started"
    background_tasks.add_task(background_process_document, job_id, req)
    return {"jobId": job_id, "status": "started"}

@app.get("/worker/jobs/{job_id}")
async def get_job_status(job_id: str):
    status = jobs.get(job_id, "not_found")
    return {"jobId": job_id, "status": status}

@app.post("/worker/chat")
async def chat_with_document(req: ChatRequest):
    # Step 1: Retrieve context from Vector DB
    context_chunks = retrieve_relevant_chunks(req.documentId, req.query, n_results=3)

    if not context_chunks:
         return {
             "content": "No relevant content found in the document to answer this query.",
             "sourcePages": [],
             "needsReview": True
         }

    # Step 2: Generate grounded response via Ollama
    ai_response = generate_chat_response(req.query, context_chunks)

    return ai_response

@app.post("/worker/teach")
async def teach_topic(req: TeachRequest):
    # Retrieve context and use Ollama to teach
    context_chunks = retrieve_relevant_chunks(req.documentId, req.topic, n_results=5)

    if not context_chunks:
         return {
             "content": f"I couldn't find detailed information about '{req.topic}' in the document.",
             "sourcePages": [],
             "needsReview": True
         }

    prompt = f"Teach me about the topic '{req.topic}' specifically for NEET-PG preparation. Highlight High-Yield facts and potential exam traps."
    ai_response = generate_chat_response(prompt, context_chunks)

    return ai_response

@app.post("/worker/generate-mcqs")
async def generate_mcqs(req: MCQRequest):
    context_chunks = retrieve_relevant_chunks(req.documentId, req.topic, n_results=5)
    if not context_chunks:
         return {"questions": []}

    prompt = f"Generate {req.count} multiple choice questions about '{req.topic}' using the provided context."
    ai_response = generate_chat_response(prompt, context_chunks)

    return {
        "questions": [
             {
                 "stem": "Based on the document, what is the primary cause mentioned for this condition?",
                 "options": ["Option A", "Option B", "Option C", "Option D"],
                 "correctOption": 0,
                 "explanation": ai_response.get("content", "Explanation not generated.")[:100] + "...",
                 "examTrap": "A common mistake is choosing B instead of A.",
                 "sourcePages": ai_response.get("sourcePages", [])
             }
        ]
    }

@app.get("/worker/health")
async def health_check():
    return {"status": "ok"}
