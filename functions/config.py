# functions/config.py

import os
from typing import Optional
from ultralytics import YOLO

# Constants
TEMP_DIR = "static/images"
SEGMENTATION_MODEL_PATH = "yolo11m-seg.pt"  # Path to segmentation model
CLASSIFICATION_MODEL_PATH = "yolo11x-cls.pt"  # Path to classification model
CROP_MARGIN = 10  # Margin for object cropping

# Create directories for storing images
os.makedirs(TEMP_DIR, exist_ok=True)

# Global model instances
segmentation_model: Optional[YOLO] = None
classification_model: Optional[YOLO] = None