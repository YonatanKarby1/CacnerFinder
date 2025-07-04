import os
from tensorflow import keras
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelLoader:

    @staticmethod
    def load_model(model_path: str) -> keras.models.Model | None:
        """Load the classification model from H5 file"""
        try:
            if os.path.exists(model_path):
                model = keras.models.load_model(model_path)
                logger.info("Model loaded successfully")
                return model
            else:
                logger.error(f"Model file not found at {model_path}")
                raise FileNotFoundError(f"Model file not found at {model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise Exception(f"Error loading model: {str(e)}")
        return None