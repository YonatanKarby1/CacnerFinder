# CancerFinder Flask API

A Flask-based REST API for image classification using TensorFlow/Keras models.

## Features

- Accepts base64 encoded images via POST requests
- Loads classification models from H5 files
- Returns prediction results with confidence scores
- CORS enabled for frontend integration
- Health check and model information endpoints
- Comprehensive error handling and logging

## Setup

### 1. Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### 2. Prepare Your Model

1. Place your trained classification model (`.h5` file) in the `model/` directory
2. Name the file `classification_model.h5`
3. Ensure your model:
   - Is saved in Keras H5 format
   - Has a softmax output layer for classification
   - Accepts input shape compatible with preprocessing (default: 224x224x3)

### 3. Customize Class Labels

Edit the `class_labels` list in `app.py` to match your model's output classes:

```python
class_labels = [
    'Benign',      # Replace with your actual class labels
    'Malignant',
    'Normal',
    # Add more classes as needed
]
```

## Running the API

### Development Mode
```bash
python app.py
```

The API will start on `http://localhost:5000`

### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### 1. Health Check
**GET** `/health`

Returns the health status of the API and whether the model is loaded.

**Response:**
```json
{
    "status": "healthy",
    "model_loaded": true
}
```

### 2. Model Information
**GET** `/model-info`

Returns information about the loaded model.

**Response:**
```json
{
    "model_loaded": true,
    "input_shape": [null, 224, 224, 3],
    "output_shape": [null, 3],
    "num_layers": 15,
    "model_summary": "Model: \"sequential\"..."
}
```

### 3. Prediction
**POST** `/predict`

Accepts a base64 encoded image and returns classification predictions.

**Request Body:**
```json
{
    "image": "base64_encoded_image_string",
    "target_size": [224, 224]  // optional, defaults to [224, 224]
}
```

**Response:**
```json
{
    "predicted_class": 1,
    "predicted_label": "Malignant",
    "confidence": 0.8542,
    "all_probabilities": {
        "Benign": 0.1234,
        "Malignant": 0.8542,
        "Normal": 0.0224
    },
    "success": true
}
```

## Testing

### Using the Test Script
```bash
python test_api.py
```

This will:
1. Test the health endpoint
2. Get model information
3. Create a sample test image
4. Make a prediction request

### Using curl
```bash
# Health check
curl http://localhost:5000/health

# Model info
curl http://localhost:5000/model-info

# Prediction (replace with actual base64 image)
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_here"}'
```

### Using Python requests
```python
import requests
import base64

# Convert image to base64
with open("your_image.jpg", "rb") as image_file:
    image_base64 = base64.b64encode(image_file.read()).decode('utf-8')

# Make prediction request
response = requests.post(
    "http://localhost:5000/predict",
    json={"image": image_base64}
)

result = response.json()
print(f"Predicted: {result['predicted_label']}")
print(f"Confidence: {result['confidence']}")
```

## Configuration

### Environment Variables
You can set these environment variables to customize the API:

- `FLASK_ENV`: Set to `development` or `production`
- `MODEL_PATH`: Custom path to your model file
- `TARGET_SIZE`: Default image size (e.g., "224,224")

### Customizing Image Preprocessing
Modify the `preprocess_image` function in `app.py` if your model requires different preprocessing:

- Change the default target size
- Modify normalization (currently [0, 1])
- Add additional preprocessing steps

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid image data
- Model loading failures
- Image preprocessing errors
- Prediction failures

All errors return appropriate HTTP status codes and error messages.

## CORS Support

CORS is enabled by default to allow frontend integration. The API accepts requests from any origin in development mode.

## Logging

The API logs all requests and errors. Logs include:
- Model loading status
- Prediction requests and results
- Error details for debugging

## Security Considerations

For production deployment:
1. Disable debug mode
2. Use HTTPS
3. Implement authentication if needed
4. Validate and sanitize input data
5. Set appropriate CORS policies 