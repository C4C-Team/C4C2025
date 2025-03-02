from flask import Flask, request, jsonify
import pymongo
import base64
import os
import json
from datetime import datetime
from typing import Dict, Any, List
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from dotenv import load_dotenv

# Add this at the top of your file, after imports
if os.path.exists('.env'):
    load_dotenv()

app = Flask(__name__)

# Configure MongoDB connection
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "trash_detection_db")
COLLECTION_NAME = os.environ.get("COLLECTION_NAME", "trash_analysis")

# Configure Vertex AI
PROJECT_ID = os.environ.get("PROJECT_ID")
LOCATION = os.environ.get("LOCATION", "us-central1")
MODEL_NAME = "gemini-1.5-pro-vision"

# Initialize Vertex AI
vertexai.init(project=PROJECT_ID, location=LOCATION)

def connect_to_mongodb():
    """Connect to MongoDB and return the collection."""
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    return collection

def analyze_image_with_gemini(image_data: str, description: str) -> Dict[str, Any]:
    """
    Analyze an image using Gemini Enterprise API via Vertex AI to detect trash.
    
    Args:
        image_data: Base64 encoded image data
        description: Text description of the image
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        # Initialize the model
        model = GenerativeModel(MODEL_NAME)
        
        # Create prompt
        prompt = """
        Analyze this image and determine if it shows trash or litter. Consider:
        - Garbage or waste materials
        - Environmental pollution
        - Improper disposal of items
        
        Provide a severity rating:
        1 = Minor (small items, limited quantity)
        2 = Moderate (noticeable garbage)
        3 = Severe (significant pollution/dump)
        
        Format response as JSON with:
        {
            "is_trash": boolean,
            "severity": integer (0-3),
            "explanation": string
        }
        """
        
        # Prepare the content parts
        content = [
            Part.from_base64(
                base64_data=image_data,
                mime_type="image/jpeg"
            ),
            Part.from_text(f"Description: {description}\n\n{prompt}")
        ]
        
        # Generate content with parameters
        response = model.generate_content(
            content,
            generation_config={
                "temperature": 0.2,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 1024,
            },
            safety_settings={
                "harassment": "block_high",
                "hate_speech": "block_high",
                "sexually_explicit": "block_high",
                "dangerous_content": "block_high"
            }
        )
        
        # Parse response
        if response and response.text:
            try:
                result = json.loads(response.text)
                return result
            except json.JSONDecodeError:
                return {
                    "error": "Invalid JSON response",
                    "is_trash": False,
                    "severity": 0,
                    "explanation": "Failed to parse response"
                }
        else:
            return {
                "error": "No response from model",
                "is_trash": False,
                "severity": 0,
                "explanation": "Model returned no content"
            }
            
    except Exception as e:
        return {
            "error": f"Error calling Gemini API: {str(e)}",
            "is_trash": False,
            "severity": 0,
            "explanation": "Analysis failed"
        }

@app.route('/api/analyze-trash', methods=['POST'])
def analyze_trash():
    """API endpoint to analyze if an image contains trash."""
    try:
        data = request.json
        
        # Get image data and description directly from the request
        image_base64 = data.get("image_data")
        description = data.get("description", "")
        user_id = data.get("user_id", "anonymous")
        
        if not image_base64:
            return jsonify({"error": "No image data provided"}), 400
        
        # Call Gemini API to analyze the image
        analysis_result = analyze_image_with_gemini(image_base64, description)
        
        # Store the analysis results in MongoDB
        collection = connect_to_mongodb()
        record = {
            "user_id": user_id,
            "description": description,
            "analysis_result": analysis_result,
            "analyzed_at": datetime.now(),
            # Store image hash or reference rather than full image to save space
            "image_hash": hash(image_base64)  # Use a proper hashing function in production
        }
        
        # Insert the record into MongoDB
        insert_result = collection.insert_one(record)
        
        # Add the MongoDB ID to the result
        analysis_result["record_id"] = str(insert_result.inserted_id)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500

if __name__ == "__main__":
    # Make sure API key is set
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY environment variable not set")
        exit(1)
        
    app.run(debug=True)