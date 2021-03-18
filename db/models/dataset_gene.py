from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey
from .base import Base


class DatasetGene(Base):
    __tablename__ = "dataset_gene"
    id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer, ForeignKey("dataset.dataset_id"))
    gene_id = Column(Integer, ForeignKey("gene.gene_id"))
