from .model_loader import ModelLoader
from .prediction_result import PredictionResult
from pydantic import BaseModel
import base64
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import io
import logging
from common.malenoma_catagories import MalenomaCatagories

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImagePredictorInput(BaseModel):
    image_base64: str
    target_size: tuple[int, int] = (224, 224)

class ImagePredictor:

    _catagory_array = [cat for cat in MalenomaCatagories]

    def __init__(self, model_path):
        self.model = ModelLoader.load_model(model_path)

    def predict(self, input: ImagePredictorInput) -> PredictionResult:
        image_data = self._preprocess_image(input.image_base64)
        prediction = self.model.predict(image_data)[0][0]
        
        predicted_class = 0 if prediction > 0.7 else 1
        # Calculate the confidence
        confidence = prediction if predicted_class == 0 else 1 - prediction


        return PredictionResult(
            catagory=self._catagory_array[predicted_class],
            confidence=confidence,  
            image_base64=input.image_base64
        )

    def _preprocess_image(self, image_data_base64: str, target_size=(224, 224)):
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data_base64)
            
            # Load image using tensorflow.keras.preprocessing.image
            loaded_image = load_img(io.BytesIO(image_bytes), target_size=target_size)
            img_array = img_to_array(loaded_image)
            img_array = np.expand_dims(img_array, axis=0)  # Shape becomes (1, 224, 224, 3)
            img_array = img_array / 255.0  # normalize
            return img_array

        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise