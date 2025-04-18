# functions/image_processor.py

import os
import cv2
import numpy as np
from typing import List, Dict, Any, Optional, Tuple

from functions.config import CROP_MARGIN

def crop_objects(image_path: str, boxes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Crop detected objects from the original image
    
    Args:
        image_path: Path to the input image
        boxes: List of bounding box dictionaries with x1, y1, x2, y2 coordinates
        
    Returns:
        List of dictionaries containing cropped images and their box indices
    """
    # Handle file not found error
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at {image_path}")
        return []
        
    image = cv2.imread(image_path)
    
    # Handle image loading error
    if image is None:
        print(f"Error: Failed to load image at {image_path}")
        return []
    
    crops = []
    
    for idx, box in enumerate(boxes):
        x1, y1, x2, y2 = int(box["x1"]), int(box["y1"]), int(box["x2"]), int(box["y2"])
        # Add a small margin to ensure the object is fully captured
        x1 = max(0, x1 - CROP_MARGIN)
        y1 = max(0, y1 - CROP_MARGIN)
        x2 = min(image.shape[1], x2 + CROP_MARGIN)
        y2 = min(image.shape[0], y2 + CROP_MARGIN)
        
        # Crop the image
        crop = image[y1:y2, x1:x2]
        crops.append({
            "crop": crop,
            "box_index": idx
        })
    
    return crops

def process_segmentation_results(results) -> List[Dict[str, Any]]:
    """Convert YOLO segmentation results to a serializable format
    
    Args:
        results: YOLO model detection results
        
    Returns:
        List of dictionaries containing processed detection results
    """
    if not results or len(results) == 0:
        print("Warning: No segmentation results received")
        return []
        
    # Check if results is a valid object with expected attributes
    try:
        # Verify the first result has the expected attributes
        if not hasattr(results[0], 'boxes') and not hasattr(results[0], 'masks'):
            print("Warning: Results object doesn't have expected attributes")
            return []
    except (IndexError, AttributeError, TypeError) as e:
        print(f"Error processing segmentation results: {str(e)}")
        return []
        
    processed_results = []
    
    for result in results:
        # Process detections
        boxes = []
        if result.boxes is not None:
            for i, box in enumerate(result.boxes.data):
                x1, y1, x2, y2, conf, cls = box
                cls_int = int(cls)
                boxes.append({
                    "x1": float(x1),
                    "y1": float(y1),
                    "x2": float(x2),
                    "y2": float(y2),
                    "confidence": float(conf),
                    "class": cls_int,
                    "class_name": result.names[cls_int] if cls_int in result.names else "unknown",
                    "classification_results": None,  # Will be filled later
                    "crop_url": None,  # Will be filled later
                })
        
        # Process segmentation data
        masks = []
        if result.masks is not None:
            for i, mask in enumerate(result.masks.data):
                # Convert mask tensor to a list of points
                mask_points = mask.tolist() if hasattr(mask, 'tolist') else mask
                masks.append(mask_points)
        
        processed_results.append({
            "boxes": boxes,
            "masks": masks,
            "shape": result.orig_shape
        })
    
    return processed_results

def process_classification_results(cls_results, box_index: int) -> Dict[str, Any]:
    """Process classification results for a single crop
    
    Args:
        cls_results: YOLO classification model results
        box_index: Index of the bounding box being classified
        
    Returns:
        Dictionary containing classification results with status and top classes
    """
    if not cls_results or len(cls_results) == 0:
        return {"status": "no_classification"}
    
    # Extract top classes and probabilities
    probs = cls_results[0].probs
    if probs is None:
        return {"status": "no_probs"}
    
    # Get top 5 classes
    top_indices = probs.top5
    top_classes = []
    for idx in top_indices:
        if idx < len(cls_results[0].names):
            top_classes.append({
                "class_id": int(idx),
                "class_name": cls_results[0].names[idx],
                "probability": float(probs.data[idx])
            })
    
    return {
        "status": "success",
        "top_classes": top_classes
    }

def draw_annotations(image_path: str, boxes: List[Dict[str, Any]], output_path: str) -> str:
    """Draw bounding boxes and classification labels on the image
    
    Args:
        image_path: Path to the input image
        boxes: List of bounding box dictionaries with detection and classification results
        output_path: Path where the annotated image will be saved
        
    Returns:
        Path to the saved annotated image
    """
    # Handle file not found error
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at {image_path}")
        raise FileNotFoundError(f"Image file not found at {image_path}")
        
    img = cv2.imread(image_path)
    
    # Handle image loading error
    if img is None:
        print(f"Error: Failed to load image at {image_path}")
        raise ValueError(f"Failed to load image at {image_path}")
    
    # Validate boxes data
    if not boxes or not isinstance(boxes, list):
        print(f"Warning: No valid boxes provided for annotation")
        return output_path
    
    for box in boxes:
        x1, y1, x2, y2 = int(box["x1"]), int(box["y1"]), int(box["x2"]), int(box["y2"])
        conf = box["confidence"]
        class_name = box["class_name"]
        
        # Draw bounding box
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        # Prepare label text
        label = f"{class_name}: {conf:.2f}"
        
        # Add classification results if available
        cls_results = box.get("classification_results")
        if cls_results and cls_results.get("status") == "success" and cls_results.get("top_classes"):
            top_class = cls_results["top_classes"][0]
            label += f" | {top_class['class_name']}: {top_class['probability']:.2f}"
        
        # Calculate label position and size
        label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)
        
        # Draw label background
        cv2.rectangle(img, (x1, y1 - 25), (x1 + label_size[0], y1), (0, 255, 0), -1)
        
        # Draw label text
        cv2.putText(img, label, (x1, y1 - 7), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the annotated image
    cv2.imwrite(output_path, img)
    return output_path