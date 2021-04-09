"""
model used for dataset table
"""
from utils.serializer import Serializer
from .db import db

class Dataset(db.Model, Serializer):
    __tablename__ = "dataset"
    dataset_id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    dataset_name = db.Column(db.String(32), primary_key=True,)
    # metadata
    pmid = db.Column(db.Text)
    title = db.Column(db.Text)
    summary = db.Column(db.Text)
    authors = db.Column(db.Text)

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized

