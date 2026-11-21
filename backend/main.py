import json
from datetime import date
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

import pymupdf
from fastapi import FastAPI, File, HTTPException, UploadFile

MAX_SIZE_MB = 20
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="AI Knowledge Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def next_id() -> int:
    ids = [int(p.stem) for p in UPLOAD_DIR.glob("*.json")]
    return max(ids, default=0) + 1


def load_doc(doc_id: int) -> dict:
    path = UPLOAD_DIR / f"{doc_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Document not found")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/documents", status_code=201)
async def upload_document(file: UploadFile = File(...)):
    name = file.filename or ""
    content = await file.read()

    # Server-side validation (the frontend checks can be bypassed)
    if not name.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="This file is empty.")
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File is too large. Maximum is {MAX_SIZE_MB} MB.")
    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="This is not a valid PDF.")

    # Extract text page by page, keeping page numbers
    try:
        pdf = pymupdf.open(stream=content, filetype="pdf")
    except Exception:
        raise HTTPException(status_code=400, detail="The PDF could not be read.")

    pages = [{"page": i + 1, "text": page.get_text()} for i, page in enumerate(pdf)]
    has_text = any(p["text"].strip() for p in pages)

    doc_id = next_id()
    meta = {
        "id": doc_id,
        "name": name,
        "pages": len(pages),
        "sizeMb": round(len(content) / 1024 / 1024, 1),
        "uploadedAt": date.today().isoformat(),
        "status": "ready" if has_text else "error",
    }

    (UPLOAD_DIR / f"{doc_id}.pdf").write_bytes(content)
    (UPLOAD_DIR / f"{doc_id}.json").write_text(
        json.dumps({**meta, "pageTexts": pages}), encoding="utf-8"
    )
    return meta


@app.get("/documents")
def list_documents():
    docs = []
    for path in UPLOAD_DIR.glob("*.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        data.pop("pageTexts", None)
        docs.append(data)
    return sorted(docs, key=lambda d: d["id"], reverse=True)


@app.get("/documents/{doc_id}/text")
def get_document_text(doc_id: int):
    return load_doc(doc_id)


@app.delete("/documents/{doc_id}", status_code=204)
def delete_document(doc_id: int):
    load_doc(doc_id)  # raises 404 if missing
    (UPLOAD_DIR / f"{doc_id}.json").unlink()
    (UPLOAD_DIR / f"{doc_id}.pdf").unlink(missing_ok=True)