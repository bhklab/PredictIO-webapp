from ..db import db
from utils.serializer import Serializer

class DatasetIdentifier(db.Model, Serializer):
    __tablename__ = "dataset_identifier"
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey("dataset.dataset_id"))
    identifier = db.Column(db.Text)
    link = db.Column(db.Text)

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized