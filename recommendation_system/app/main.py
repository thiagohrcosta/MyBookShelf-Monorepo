from fastapi import Body, FastAPI

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/recommend")
def recommend(payload: dict = Body(default=None)):
    return {
        "message": "received",
        "data": payload or {},
    }
