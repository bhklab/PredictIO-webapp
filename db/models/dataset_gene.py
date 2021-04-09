from utils.serializer import Serializer
from ..db import db


class DatasetGene(db.Model, Serializer):
    __tablename__ = "dataset_gene"
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey("dataset.dataset_id"))
    gene_id = db.Column(db.Integer, db.ForeignKey("gene.gene_id"))

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized