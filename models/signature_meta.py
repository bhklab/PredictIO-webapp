# model used for signature_meta table
from .db import db
from utils.serializer import Serializer

class Meta(db.Model, Serializer):
    __tablename__ = 'signature_meta'
    
    signature = db.Column(db.String, primary_key=True)
    outcome = db.Column(db.String, primary_key=True)
    model = db.Column(db.String, primary_key=True)
    subgroup = db.Column(db.String, primary_key=True)
    tissue_type = db.Column(db.String, primary_key=True)
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