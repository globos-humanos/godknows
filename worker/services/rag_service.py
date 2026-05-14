import chromadb
import os
import uuid
from .embedding_service import generate_embedding

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "../chroma")
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

def get_or_create_collection(collection_name: str):
    return chroma_client.get_or_create_collection(name=collection_name)

def store_chunk_in_vector_db(document_id: str, text: str, metadata: dict):
    collection_name = f"doc_{document_id}"
    collection = get_or_create_collection(collection_name)
    embedding = generate_embedding(text)

    # Generate a unique ID for the chunk in the vector DB
    chunk_id = str(uuid.uuid4())

    if embedding:
        collection.add(
            ids=[chunk_id],
            documents=[text],
            metadatas=[metadata],
            embeddings=[embedding]
        )

def retrieve_relevant_chunks(document_id: str, query: str, n_results: int = 5):
    collection_name = f"doc_{document_id}"

    try:
        collection = chroma_client.get_collection(name=collection_name)
    except Exception:
        print(f"Collection {collection_name} not found. Fallback or return empty.")
        return []

    query_embedding = generate_embedding(query)

    if not query_embedding:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    # Format the results into a list of dictionaries
    retrieved = []
    if results and 'documents' in results and results['documents']:
        for idx in range(len(results['documents'][0])):
            retrieved.append({
                "text": results['documents'][0][idx],
                "metadata": results['metadatas'][0][idx] if 'metadatas' in results and results['metadatas'] else {}
            })

    return retrieved
