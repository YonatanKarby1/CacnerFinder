import requests
import base64
import json
import os
from PIL import Image
import io

def image_to_base64(image_path):
    """Convert an image file to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_api():
    """Test the Flask API endpoints"""
    base_url = "http://localhost:5000"
    
    # Test health endpoint
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the server is running.")
        return
    
    # Test model info endpoint
    print("\nTesting model info endpoint...")
    try:
        response = requests.get(f"{base_url}/model-info")
        print(f"Model info: {response.json()}")
    except Exception as e:
        print(f"Error getting model info: {e}")
    
    # Test prediction endpoint with a sample image
    print("\nTesting prediction endpoint...")
    
    # Create a sample image for testing (if no real image is available)
    sample_image_path = "test_image.jpg"
    
    # Check if test image exists, if not create a simple one
    if not os.path.exists(sample_image_path):
        print("Creating a sample test image...")
        # Create a simple test image
        img = Image.new('RGB', (224, 224), color='red')
        img.save(sample_image_path)
        print(f"Created test image: {sample_image_path}")
    
    try:
        # Convert image to base64
        image_base64 = image_to_base64(sample_image_path)
        
        # Prepare request payload
        payload = {
            "image": image_base64,
            "target_size": [224, 224]
        }
        
        # Make prediction request
        response = requests.post(
            f"{base_url}/predict",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("Prediction successful!")
            print(f"Predicted class: {result['predicted_class']}")
            print(f"Predicted label: {result['predicted_label']}")
            print(f"Confidence: {result['confidence']:.4f}")
            print(f"All probabilities: {result['all_probabilities']}")
        else:
            print(f"Prediction failed with status code: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error during prediction test: {e}")

if __name__ == "__main__":
    test_api() 