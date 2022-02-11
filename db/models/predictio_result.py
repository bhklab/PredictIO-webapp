from utils.serializer import Serializer
from ..db import db

class PredictIOResult(db.Model, Serializer):
    __tablename__ = "predictio_result"
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    analysis_id = db.Column(db.String(255), db.ForeignKey("analysis_request.analysis_id"))
    patient_id = db.Column(db.String(255))
    predictio_value = db.Column(db.Float)

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized