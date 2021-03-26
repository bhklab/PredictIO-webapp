from utils.serializer import Serializer
from ..db import db

class Gene(db.Model, Serializer):
    __tablename__ = "gene"
    gene_id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    gene_name = db.Column(db.String(32))
    dataset_genes = db.relationship("DatasetGene", backref="gene")

    def serialize(self):
        serialized = Serializer.serialize(self)
        return serialized
