"""Test script for FastAPI startup with model loading diagnostics"""

import asyncio
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
import os
import sys
import importlib

# Add debug info
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")

# Import configuration module
try:
    from functions import config
    print(f"Successfully imported config module: {config}")
    print(f"Config module ID: {id(config)}")
except Exception as e:
    print(f"Error importing config: {e}")
    sys.exit(1)

# Import models
try:
    from ultralytics import YOLO
    print(f"Successfully imported YOLO from ultralytics")
except Exception as e:
    print(f"Error importing YOLO: {e}")
    sys.exit(1)

# Test model loading directly
print("=== Testing direct model loading ===")
try:
    print(f"Loading segmentation model from {config.SEGMENTATION_MODEL_PATH}")
    seg_model = YOLO(config.SEGMENTATION_MODEL_PATH)
    print("Segmentation model loaded successfully")
    
    print(f"Loading classification model from {config.CLASSIFICATION_MODEL_PATH}")
    cls_model = YOLO(config.CLASSIFICATION_MODEL_PATH)
    print("Classification model loaded successfully")
except Exception as e:
    print(f"Error loading models directly: {e}")

# Create a minimal FastAPI app with the lifespan context manager
print("=== Testing lifespan context manager ===")

# Import the lifespan function
try:
    from functions.model_manager import lifespan
    print(f"Successfully imported lifespan: {lifespan}")
except Exception as e:
    print(f"Error importing lifespan: {e}")

@asynccontextmanager
async def custom_lifespan(app: FastAPI):
    print("Entering custom lifespan")
    try:
        # Run the original lifespan
        async with lifespan(app):
            # Inspect model variables after lifespan executes
            print(f"After lifespan execution:")
            print(f"Config module ID: {id(config)}")
            print(f"Segmentation model: {config.segmentation_model}")
            print(f"Classification model: {config.classification_model}")
            yield
    finally:
        print("Exiting custom lifespan")

app = FastAPI(lifespan=custom_lifespan)

@app.get("/test")
async def test_route():
    return {
        "segmentation_model_loaded": config.segmentation_model is not None,
        "classification_model_loaded": config.classification_model is not None
    }

# Run test server
if __name__ == "__main__":
    print("Starting test server")
    uvicorn.run(app, host="127.0.0.1", port=8001) 