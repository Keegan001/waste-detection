from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.responses import FileResponse
import uvicorn
import os

from functions.model_manager import lifespan
from functions.routes import predict, health_check

# Initialize FastAPI with lifespan
app = FastAPI(
    title="YOLO Two-Stage API", 
    description="API for object detection and classification using YOLO models",
    lifespan=lifespan
)

# Add CORS middleware with specific origins
# In production, replace * with your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for serving images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register routes
app.post("/predict", response_class=JSONResponse)(predict)
app.get("/health")(health_check)

# Serve index.html at root path
@app.get("/", response_class=HTMLResponse)
async def get_index():
    return FileResponse("index.html")

# Also serve index.html at /index.html path for direct access
@app.get("/index.html", response_class=HTMLResponse)
async def get_index_html():
    return FileResponse("index.html")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)