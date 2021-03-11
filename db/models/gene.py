from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from sqlalchemy.orm import relationship
from base import Base


class Gene(Base):
    __tablename__ = "gene"
    gene_id = Column(Integer, primary_key=True)
    gene_name = Column(String(32))
    dataset_genes = relationship("DatasetGene", backref="gene")
