from fastapi import FastAPI

app= FastAPI(title="AI KNowledge Assistant API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/hello/{name}")
def hello(name: str):
    """Greets a person by name."""
    return {"message": f"Hello, {name}!"}