from utils.serializer import Serializer
from ..db import db


class Patient(db.Model, Serializer):
    __tablename__ = "patient"
    patient_id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey("dataset.dataset_id"))
    age = db.Column(db.Integer)
    patient = db.Column(db.String(32))
    sex = db.Column(db.String(32))
    primary_tissue = db.Column(db.String(32))
    histo = db.Column(db.String(32))
    stage = db.Column(db.String(32))
    response_other_info = db.Column(db.String(32))
    recist = db.Column(db.String(32))
    response = db.Column(db.String(32))
    drug_type = db.Column(db.String(32))
    dna = db.Column(db.String(32))
    rna = db.Column(db.String(32))
    expression = db.Column(db.Integer)
    cna = db.Column(db.Integer)
    snv = db.Column(db.Integer)

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized
