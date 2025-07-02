"""
Example integration script showing how to use the Flask API
from a frontend application or other Python scripts.
"""

import requests
import base64
import json
from typing import Dict, Any, Optional

class CancerFinderAPI:
    """Client class for interacting with the CancerFinder Flask API"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url.rstrip('/')
    
    def health_check(self) -> Dict[str, Any]:
        """Check if the API is healthy and model is loaded"""
        try:
            response = requests.get(f"{self.base_url}/health")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e), "status": "unhealthy"}
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model"""
        try:
            response = requests.get(f"{self.base_url}/model-info")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
    
    def predict_from_file(self, image_path: str, target_size: tuple = (224, 224)) -> Dict[str, Any]:
        """
        Make a prediction using an image file
        
        Args:
            image_path: Path to the image file
            target_size: Target size for preprocessing (width, height)
        
        Returns:
            Prediction results
        """
        try:
            # Convert image to base64
            with open(image_path, "rb") as image_file:
                image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
            
            return self.predict_from_base64(image_base64, target_size)
            
        except FileNotFoundError:
            return {"error": f"Image file not found: {image_path}"}
        except Exception as e:
            return {"error": f"Error reading image file: {str(e)}"}
    
    def predict_from_base64(self, image_base64: str, target_size: tuple = (224, 224)) -> Dict[str, Any]:
        """
        Make a prediction using a base64 encoded image
        
        Args:
            image_base64: Base64 encoded image string
            target_size: Target size for preprocessing (width, height)
        
        Returns:
            Prediction results
        """
        try:
            payload = {
                "image": image_base64,
                "target_size": list(target_size)
            }
            
            response = requests.post(
                f"{self.base_url}/predict",
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}

def example_usage():
    """Example usage of the CancerFinderAPI class"""
    
    # Initialize API client
    api = CancerFinderAPI()
    
    print("=== CancerFinder API Integration Example ===\n")
    
    # 1. Health check
    print("1. Checking API health...")
    health = api.health_check()
    print(f"Health status: {health}\n")
    
    # 2. Get model information
    print("2. Getting model information...")
    model_info = api.get_model_info()
    if "error" not in model_info:
        print(f"Model loaded: {model_info.get('model_loaded', False)}")
        print(f"Input shape: {model_info.get('input_shape')}")
        print(f"Output shape: {model_info.get('output_shape')}")
    else:
        print(f"Error: {model_info['error']}")
    print()
    
    # 3. Make prediction (example with a test image)
    print("3. Making prediction...")
    
    # You can replace this with your actual image path
    test_image_path = "test_image.jpg"
    
    # Check if test image exists
    import os
    if os.path.exists(test_image_path):
        result = api.predict_from_file(test_image_path)
        
        if "error" not in result:
            print("Prediction successful!")
            print(f"Predicted class: {result['predicted_class']}")
            print(f"Predicted label: {result['predicted_label']}")
            print(f"Confidence: {result['confidence']:.4f}")
            print("All probabilities:")
            for label, prob in result['all_probabilities'].items():
                print(f"  {label}: {prob:.4f}")
        else:
            print(f"Prediction failed: {result['error']}")
    else:
        print(f"Test image not found: {test_image_path}")
        print("Please place an image file in the Backend directory to test predictions.")

def frontend_integration_example():
    """Example of how to integrate with a frontend application"""
    
    print("\n=== Frontend Integration Example ===\n")
    
    # This is how you might integrate with a React/JavaScript frontend
    js_code = '''
// JavaScript/React example for frontend integration

async function predictImage(imageFile) {
    try {
        // Convert image to base64
        const base64 = await fileToBase64(imageFile);
        
        // Make API request
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64,
                target_size: [224, 224]
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Prediction:', result.predicted_label);
            console.log('Confidence:', result.confidence);
            return result;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Prediction failed:', error);
        throw error;
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}
'''
    
    print("JavaScript/React integration code:")
    print(js_code)

if __name__ == "__main__":
    example_usage()
    frontend_integration_example() 