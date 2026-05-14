# RecallPG

A NotebookLM-style AI study companion specifically for NEET-PG 2026 preparation.
Built with a local-first architecture using Ollama, Docling, and ChromaDB.

## Features
- Local-first AI using Ollama (no paid APIs required).
- PDF parsing and document understanding using Docling.
- Local OCR using PaddleOCR.
- Local vector database using ChromaDB.
- Spaced repetition and weak-topic tracking.
- Test mode and Rapid Revision.

## Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB
- [Ollama](https://ollama.ai/)

## Setup Instructions

### 1. Install & Configure Ollama
1. Download and install [Ollama](https://ollama.ai/).
2. Pull the required models:
   \`\`\`bash
   ollama pull qwen2.5:7b
   ollama pull nomic-embed-text
   \`\`\`

### 2. Start MongoDB
Ensure MongoDB is running locally on port 27017 (default).

### 3. Install Dependencies
In the root directory, run:
\`\`\`bash
npm install
npm run install:all
npm run install:worker
\`\`\`

### 4. Configure Environment Variables
Copy \`.env.example\` to \`.env\` in the root, server, and client directories and update them if necessary.

### 5. Run the Application
In the root directory, start everything concurrently:
\`\`\`bash
npm run dev &
\`\`\`
