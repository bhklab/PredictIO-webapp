"""
model used for signature_kegg_network table
"""
from utils.serializer import Serializer
from ..db import db

class SignatureKeggNetwork(db.Model, Serializer):
    __tablename__ = 'signature_kegg_network'
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    analysis_id = db.Column(db.String(255), db.ForeignKey("analysis_request.analysis_id"))
    cluster = db.Column(db.Integer)
    pathway = db.Column(db.String(255))

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized