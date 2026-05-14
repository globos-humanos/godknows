from paddleocr import PaddleOCR
import fitz # PyMuPDF
import os

# Initialize PaddleOCR (runs locally)
ocr = PaddleOCR(use_angle_cls=True, lang='en')

def extract_ocr_from_pdf(file_path: str):
    """
    Renders PDF pages to images and runs PaddleOCR on them.
    This acts as a fallback or supplement to Docling.
    """
    try:
        pdf_document = fitz.open(file_path)
        chunks = []

        for page_number in range(len(pdf_document)):
            page = pdf_document[page_number]
            # Render page to an image (pixmap)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_path = f"/tmp/page_{page_number}.png"
            pix.save(img_path)

            # Run PaddleOCR
            result = ocr.ocr(img_path, cls=True)

            if result and result[0]:
                page_text = []
                total_confidence = 0
                box_count = 0

                for line in result[0]:
                    text = line[1][0]
                    confidence = line[1][1]
                    page_text.append(text)
                    total_confidence += confidence
                    box_count += 1

                avg_confidence = total_confidence / box_count if box_count > 0 else 0

                if page_text:
                    chunks.append({
                        "text": " ".join(page_text),
                        "page_number": page_number + 1,
                        "topic": "OCR Extracted",
                        "source_type": "printedOCR",
                        "confidence": avg_confidence
                    })

            # Clean up temp image
            if os.path.exists(img_path):
                os.remove(img_path)

        return chunks
    except Exception as e:
        print(f"Error running PaddleOCR on {file_path}: {e}")
        return []
