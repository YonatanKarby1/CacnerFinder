from common.malenoma_catagories import MalenomaCatagories
from pydantic import BaseModel

class PredictionResult(BaseModel):
    catagory: MalenomaCatagories
    confidence: float
    image_base64: str