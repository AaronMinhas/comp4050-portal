from fastapi import FastAPI

app = FastAPI(
    title="FitPortal API",
    description="Backend API for FitPortal.",
    version="0.1.0",
)


@app.get("/health", tags=["status"])
def health() -> dict[str, str]:
    return {"status": "ok"}
