# functions/routes.py

import os
import uuid
import shutil
import cv2
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Any

from functions import config
from functions.image_processor import (
    crop_objects,
    process_segmentation_results,
    process_classification_results,
    draw_annotations
)

async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Two-stage endpoint: 
    1. Perform segmentation to detect objects
    2. Classify each detected object
    3. Return annotated images with detection results
    
    Args:
        file: Uploaded image file
        
    Returns:
        Dictionary containing detection and classification results with image URLs
        
    Raises:
        HTTPException: If models are not loaded, file is not an image, or processing fails
    """
    # Guard clauses for error conditions
    if not config.segmentation_model or not config.classification_model:
        raise HTTPException(status_code=500, detail="Models not loaded")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create a unique ID for this request
    request_id = str(uuid.uuid4())
    
    # Create a unique filename
    file_extension = os.path.splitext(file.filename)[1] if "." in file.filename else ".jpg"
    temp_file = f"{config.TEMP_DIR}/input_{request_id}{file_extension}"
    
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(temp_file), exist_ok=True)
        
        # Save uploaded file temporarily
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Step 1: Run segmentation
        seg_results = config.segmentation_model(temp_file)
        
        # Process segmentation results
        processed_data = process_segmentation_results(seg_results)
        
        # Handle case with no detection results
        if not processed_data or len(processed_data) == 0:
            return {
                "status": "success", 
                "request_id": request_id,
                "image_urls": {
                    "original_image": f"/static/images/input_{request_id}{file_extension}",
                    "annotated_image": f"/static/images/input_{request_id}{file_extension}"
                },
                "results": []
            }
        
        # Extract bounding boxes
        boxes = processed_data[0]["boxes"]
        
        # Crop objects
        cropped_objects = crop_objects(temp_file, boxes)
        
        # Classify each crop
        for crop_info in cropped_objects:
            crop = crop_info["crop"]
            box_index = crop_info["box_index"]
            
            # Save crop as an image
            crop_filename = f"{config.TEMP_DIR}/crop_{request_id}_{box_index}{file_extension}"
            
            # Ensure directory exists for crop images
            os.makedirs(os.path.dirname(crop_filename), exist_ok=True)
            
            # Save crop with error handling
            try:
                cv2.imwrite(crop_filename, crop)
            except Exception as crop_error:
                print(f"Error saving crop image: {str(crop_error)}")
                # Continue processing even if crop saving fails
                processed_data[0]["boxes"][box_index]["crop_url"] = None
                continue
            
            # Store crop URL
            crop_url = f"/static/images/crop_{request_id}_{box_index}{file_extension}"
            processed_data[0]["boxes"][box_index]["crop_url"] = crop_url
            
            # Run classification
            try:
                cls_results = config.classification_model(crop_filename)
                
                # Process classification results
                cls_processed = process_classification_results(cls_results, box_index)
                
                # Add classification results to the corresponding box
                processed_data[0]["boxes"][box_index]["classification_results"] = cls_processed
            except Exception as e:
                processed_data[0]["boxes"][box_index]["classification_results"] = {
                    "status": "error",
                    "message": str(e)
                }
        
        # Create annotated image with bounding boxes and labels
        annotated_image_path = f"{config.TEMP_DIR}/annotated_{request_id}{file_extension}"
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(annotated_image_path), exist_ok=True)
        
        # Draw annotations and handle potential errors
        try:
            draw_annotations(temp_file, processed_data[0]["boxes"], annotated_image_path)
        except Exception as e:
            print(f"Error drawing annotations: {str(e)}")
            # Use original image as fallback if annotation fails
            shutil.copy(temp_file, annotated_image_path)
        
        # Copy original image to static directory for access via URL
        original_image_path = f"{config.TEMP_DIR}/input_{request_id}{file_extension}"
        try:
            shutil.copy(temp_file, original_image_path)
        except Exception as e:
            print(f"Error copying original image: {str(e)}")
            # Use temp file path if copy fails
            original_image_path = temp_file
        
        # Add URLs for the original and annotated images
        result_urls = {
            "original_image": f"/static/images/input_{request_id}{file_extension}",
            "annotated_image": f"/static/images/annotated_{request_id}{file_extension}"
        }
        
        # Full base URL will be added by frontend
        return {
            "status": "success", 
            "request_id": request_id,
            "image_urls": result_urls,
            "results": processed_data
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        # Clean up any temporary files that might have been created
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except:
                pass
        
        # Provide more detailed error information
        error_detail = f"Error processing image: {str(e)}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=error_detail)

async def health_check() -> Dict[str, Any]:
    """Health check endpoint
    
    Returns:
        Dictionary containing API health status and model loading status
    """
    # Check if model files exist
    seg_file_exists = os.path.exists(config.SEGMENTATION_MODEL_PATH)
    cls_file_exists = os.path.exists(config.CLASSIFICATION_MODEL_PATH)
    
    # Get absolute paths
    seg_abs_path = os.path.abspath(config.SEGMENTATION_MODEL_PATH)
    cls_abs_path = os.path.abspath(config.CLASSIFICATION_MODEL_PATH)
    
    return {
        "status": "healthy",
        "segmentation_model_loaded": config.segmentation_model is not None,
        "classification_model_loaded": config.classification_model is not None,
        "model_file_check": {
            "segmentation_model_file_exists": seg_file_exists,
            "classification_model_file_exists": cls_file_exists,
            "segmentation_model_path": seg_abs_path,
            "classification_model_path": cls_abs_path,
            "current_directory": os.getcwd()
        }
    }