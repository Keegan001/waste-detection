import os
import traceback
from ultralytics import YOLO

# Constants from config.py
SEGMENTATION_MODEL_PATH = "yolo11m-seg.pt"  # Path to segmentation model
CLASSIFICATION_MODEL_PATH = "yolo11x-cls.pt"  # Path to classification model

def test_model_loading():
    """Test loading YOLO models with detailed error output"""
    
    print("-" * 50)
    print("TESTING MODEL LOADING")
    print("-" * 50)
    
    print(f"Current working directory: {os.getcwd()}")
    
    # Check if model files exist
    seg_model_exists = os.path.exists(SEGMENTATION_MODEL_PATH)
    cls_model_exists = os.path.exists(CLASSIFICATION_MODEL_PATH)
    
    print(f"Segmentation model path: {SEGMENTATION_MODEL_PATH}")
    print(f"Classification model path: {CLASSIFICATION_MODEL_PATH}")
    print(f"Segmentation model path exists: {seg_model_exists}")
    print(f"Classification model path exists: {cls_model_exists}")
    
    # Check absolute paths
    seg_abs_path = os.path.abspath(SEGMENTATION_MODEL_PATH)
    cls_abs_path = os.path.abspath(CLASSIFICATION_MODEL_PATH)
    print(f"Absolute segmentation model path: {seg_abs_path}")
    print(f"Absolute classification model path: {cls_abs_path}")
    
    # Check file size
    if seg_model_exists:
        seg_size = os.path.getsize(SEGMENTATION_MODEL_PATH) / (1024 * 1024)  # MB
        print(f"Segmentation model file size: {seg_size:.2f} MB")
    else:
        print("Segmentation model file not found")
    
    if cls_model_exists:
        cls_size = os.path.getsize(CLASSIFICATION_MODEL_PATH) / (1024 * 1024)  # MB
        print(f"Classification model file size: {cls_size:.2f} MB")
    else:
        print("Classification model file not found")
    
    # Try to load models
    try:
        print("\nAttempting to load segmentation model...")
        segmentation_model = YOLO(SEGMENTATION_MODEL_PATH)
        print("Segmentation model loaded successfully!")
    except Exception as e:
        print(f"ERROR loading segmentation model: {str(e)}")
        print("Stack trace:")
        traceback.print_exc()
    
    try:
        print("\nAttempting to load classification model...")
        classification_model = YOLO(CLASSIFICATION_MODEL_PATH)
        print("Classification model loaded successfully!")
    except Exception as e:
        print(f"ERROR loading classification model: {str(e)}")
        print("Stack trace:")
        traceback.print_exc()
    
    print("-" * 50)
    print("TEST COMPLETE")
    print("-" * 50)

if __name__ == "__main__":
    test_model_loading() 