#!/usr/bin/env python3
"""
Startup script for the CancerFinder Flask API
"""

import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'flask',
        'flask_cors', 
        'numpy',
        'tensorflow'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'flask_cors':
                import flask_cors
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"Missing required packages: {', '.join(missing_packages)}")
        logger.error("Please install them using: pip install -r requirements.txt")
        return False
    
    return True

def check_model_file():
    """Check if the model file exists"""
    model_path = Path(__file__).parent / 'model' / 'classification_model.h5'
    
    if not model_path.exists():
        logger.warning(f"Model file not found at: {model_path}")
        logger.warning("The API will start but predictions will fail until a model is provided.")
        logger.warning("Please place your trained model file as 'classification_model.h5' in the model/ directory.")
        return False
    
    logger.info(f"Model file found at: {model_path}")
    return True

def main():
    """Main startup function"""
    print("=" * 50)
    print("CancerFinder Flask API")
    print("=" * 50)
    
    # Check dependencies
    logger.info("Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    # Check model file
    logger.info("Checking model file...")
    model_exists = check_model_file()
    
    # Import and run the Flask app
    try:
        from app import app, load_model
        
        # Load model if file exists
        if model_exists:
            if load_model():
                logger.info("Model loaded successfully!")
            else:
                logger.error("Failed to load model. API will start but predictions will fail.")
        else:
            logger.warning("Starting API without model loaded.")
        
        # Start the Flask server
        logger.info("Starting Flask API server...")
        logger.info("API will be available at: http://localhost:5000")
        logger.info("Press Ctrl+C to stop the server")
        
        app.run(
            debug=True,
            host='0.0.0.0',
            port=5000,
            use_reloader=False  # Disable reloader to avoid model loading issues
        )
        
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 