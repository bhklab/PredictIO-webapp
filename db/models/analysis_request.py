from utils.serializer import Serializer
from ..db import db

class AnalysisRequest(db.Model, Serializer):
    __tablename__ = "analysis_request"
    analysis_id = db.Column(db.String(255), primary_key=True)
    analysis_type = db.Column(db.String(32))
    email = db.Column(db.String(255))
    error = db.Column(db.Boolean)
    error_message = db.Column(db.String(255))
    time_submitted = db.Column(db.DateTime)
    time_completed = db.Column(db.DateTime)
    input_genes = db.Column(db.String(255))
    input_datatype = db.Column(db.String(32))
    input_sex = db.Column(db.String(32))
    input_primary = db.Column(db.String(255))
    input_drug_type = db.Column(db.String(32))
    input_sequencing = db.Column(db.String(32))
    input_study = db.Column(db.String(500))
    signature_user_requested = db.relationship("UserRequested", backref="analysis_request")
    predictio_result = db.relationship("PredictIOResult", backref="predictio_result")

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized