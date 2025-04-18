# functions/model_manager.py

from contextlib import asynccontextmanager
from fastapi import FastAPI
from ultralytics import YOLO
import traceback
import os
import sys

# Import the global model variables directly
import functions.config as config

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for model loading/unloading
    
    Args:
        app: FastAPI application instance
    """
    try:
        # Print current working directory and check if model files exist
        print(f"Current working directory: {os.getcwd()}")
        seg_model_exists = os.path.exists(config.SEGMENTATION_MODEL_PATH)
        cls_model_exists = os.path.exists(config.CLASSIFICATION_MODEL_PATH)
        
        print(f"Segmentation model path: {config.SEGMENTATION_MODEL_PATH}")
        print(f"Classification model path: {config.CLASSIFICATION_MODEL_PATH}")
        print(f"Segmentation model path exists: {seg_model_exists}")
        print(f"Classification model path exists: {cls_model_exists}")
        
        # Check absolute paths
        seg_abs_path = os.path.abspath(config.SEGMENTATION_MODEL_PATH)
        cls_abs_path = os.path.abspath(config.CLASSIFICATION_MODEL_PATH)
        print(f"Absolute segmentation model path: {seg_abs_path}")
        print(f"Absolute classification model path: {cls_abs_path}")
        
        if not seg_model_exists:
            print(f"ERROR: Segmentation model file not found at {config.SEGMENTATION_MODEL_PATH}")
            raise FileNotFoundError(f"Segmentation model file not found at {config.SEGMENTATION_MODEL_PATH}")
            
        if not cls_model_exists:
            print(f"ERROR: Classification model file not found at {config.CLASSIFICATION_MODEL_PATH}")
            raise FileNotFoundError(f"Classification model file not found at {config.CLASSIFICATION_MODEL_PATH}")
        
        # Load models with explicit paths and assign directly to config module variables
        print("Loading segmentation model...")
        config.segmentation_model = YOLO(config.SEGMENTATION_MODEL_PATH)
        print(f"Segmentation model loaded successfully!")
        
        print("Loading classification model...")
        config.classification_model = YOLO(config.CLASSIFICATION_MODEL_PATH)
        print(f"Classification model loaded successfully!")
        
        # Verify models are loaded correctly
        if config.segmentation_model is None or config.classification_model is None:
            raise ValueError("Models were not initialized properly")
            
        print("Both models loaded successfully!")
        
        # Debug information to verify module references
        print(f"Module ID of config: {id(config)}")
        print(f"Segmentation model: {config.segmentation_model}")
        print(f"Classification model: {config.classification_model}")
        
    except Exception as e:
        print(f"ERROR loading models: {str(e)}")
        print("Stack trace:")
        traceback.print_exc()
        config.segmentation_model = None
        config.classification_model = None
    
    yield
    
    # Cleanup on shutdown if needed
    # Models will be garbage collected automatically