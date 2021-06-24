"""
model used for signature_network table
"""
from utils.serializer import Serializer
from ..db import db

class SignatureNetwork(db.Model, Serializer):
    __tablename__ = 'signature_network'
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    analysis_id = db.Column(db.String(255), db.ForeignKey("analysis_request.analysis_id"))
    signature = db.Column(db.String(255))
    x = db.Column(db.Float)
    y = db.Column(db.Float)
    cluster = db.Column(db.Integer)
    
    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized