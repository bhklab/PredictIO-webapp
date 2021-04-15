from utils.serializer import Serializer
from ..db import db

class AnalysisRequest(db.Model, Serializer):
    __tablename__ = "analysis_request"
    analysis_id = db.Column(db.String(255), primary_key=True)
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

    def serialize(self):
        serialized = {
            'analysis_id': self.analysis_id,
            'time_submitted': self.time_submitted.strftime('%Y-%m-%d, %H:%M:%S'),
            'time_completed': self.time_completed.strftime('%Y-%m-%d, %H:%M:%S'),
            'input_genes': self.input_genes.split(','),
            'input_datatype': self.input_datatype,
            'input_sex': self.input_sex.split(','),
            'input_primary': self.input_primary.split(','),
            'input_drug_type': self.input_drug_type.split(','),
            'input_sequencing': self.input_sequencing.split(','),
            'input_study': self.input_study.split(',')
        }
        return serialized