from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from logic.image_predictor import ImagePredictor, ImagePredictorInput
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model_predictor = ImagePredictor(model_path="./model/model.h5")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_predictor.model is not None
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
        output = model_predictor.predict(ImagePredictorInput(image_base64=image_data, target_size=target_size))
        
        response = {
            'category': output.catagory.value,
            'confidence': f"{output.confidence:.4f}",
            'success': True
        }
        
        logger.info(f"Prediction successful: {response['category']} with confidence {output.confidence:.4f}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask API server...")
    app.run(debug=True, host='0.0.0.0', port=5000)