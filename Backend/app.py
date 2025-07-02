from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.utils import to_categorical
from tensorflow import keras
import os
import logging
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store the loaded model
model: keras.models.Model | None = None

def load_model():
    """Load the classification model from H5 file"""
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'model', 'model.h5')
        if os.path.exists(model_path):
            model = keras.models.load_model(model_path)
            logger.info("Model loaded successfully")
        else:
            logger.error(f"Model file not found at {model_path}")
            return False
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False
    return True

def preprocess_image(image_data, target_size=(224, 224)):
    """
    Preprocess the image for model prediction using tensorflow.keras.preprocessing.image
    
    Args:
        image_data: Base64 encoded image string
        target_size: Target size for the image (width, height)
    
    Returns:
        Preprocessed image as numpy array
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        
        # Load image using tensorflow.keras.preprocessing.image
        loaded_image = load_img(io.BytesIO(image_bytes), target_size=target_size)
        img_array = img_to_array(loaded_image)
        img_array = np.expand_dims(img_array, axis=0)  # Shape becomes (1, 224, 224, 3)
        img_array = img_array / 255.0  # normalize
        return img_array

    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'error': 'Missing image data in request body'
            }), 400
        
        # Get image data
        image_data = data['image']
        target_size = tuple(data.get('target_size', [224, 224]))
        
        # Preprocess image
        processed_image = preprocess_image(image_data, target_size)
        
        # Define class labels (modify these based on your model's classes)
        class_labels = [
            'malignant',  # Replace with your actual class labels
            'benign',
        ]

        # Make prediction
        predictions = model.predict(processed_image)
        
        # Get prediction results
        prediction = predictions[0][0]
        predicted_class = 0 if prediction > 0.7 else 1
        # Calculate the confidence
        confidence = prediction if predicted_class == 0 else 1 - prediction
        
        # Create response
        response = {
            'category': class_labels[predicted_class],
            'confidence': f"{confidence:.4f}",
            'success': True
        }
        
        logger.info(f"Prediction successful: {response['category']} with confidence {confidence:.4f}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 500
    
    try:
        model_summary = []
        model.summary(print_fn=lambda x: model_summary.append(x))
        
        return jsonify({
            'model_loaded': True,
            'input_shape': model.input_shape,
            'output_shape': model.output_shape,
            'num_layers': len(model.layers),
            'model_summary': '\n'.join(model_summary)
        })
    except Exception as e:
        return jsonify({
            'error': f'Error getting model info: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Load model on startup
    if load_model():
        logger.info("Starting Flask API server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        logger.error("Failed to load model. Server not started.") 