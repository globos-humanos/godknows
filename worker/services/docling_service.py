from docling.document_converter import DocumentConverter
from docling.datamodel.document import InputFormat
import os

# Initialize the converter
converter = DocumentConverter()

def extract_pdf_chunks(file_path: str):
    """
    Extract text chunks and layout information from a PDF using Docling.
    This provides high-quality text extraction before falling back to OCR.
    """
    try:
        # Convert the document
        result = converter.convert(file_path)
        doc = result.document

        chunks = []
        for element, level in doc.iterate_items():
            if hasattr(element, 'text') and element.text:
                page_no = element.prov[0].page_no if hasattr(element, 'prov') and element.prov else 1

                chunks.append({
                    "text": element.text,
                    "page_number": page_no,
                    "topic": getattr(element, 'label', 'text'),
                    "source_type": "selectableText",
                    "confidence": 1.0 # High confidence for docling parsed text
                })

        return chunks
    except Exception as e:
        print(f"Error extracting PDF chunks via Docling: {e}")
        return []
