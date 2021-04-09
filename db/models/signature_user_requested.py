"""
model used for signature_user_requested table
"""
from utils.serializer import Serializer
from ..db import db

class UserRequested(db.Model, Serializer):
    __tablename__ = 'signature_user_requested'
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    analysis_id = db.Column(db.String(255), db.ForeignKey("analysis_request.analysis_id"))
    study = db.Column(db.String(32))
    primary_tissue = db.Column(db.String(32))
    outcome = db.Column(db.String(32))
    model = db.Column(db.String(32))
    sequencing = db.Column(db.String(32))
    meta_analysis = db.Column(db.Integer)
    subgroup = db.Column(db.String(32))
    tissue_type = db.Column(db.String(32))
    n = db.Column(db.Integer)
    effect_size = db.Column(db.Float)
    se = db.Column(db.Float)
    _95ci_low = db.Column(db.Float)
    _95ci_high = db.Column(db.Float)
    pval = db.Column(db.Float)
    i2 = db.Column(db.Float)
    pval_i2 = db.Column(db.Float)

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized
