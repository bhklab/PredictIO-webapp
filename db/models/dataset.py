from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Text
from sqlalchemy.orm import relationship
from .base import Base


class Dataset(Base):
    __tablename__ = "dataset"
    dataset_id = Column(Integer, primary_key=True, index=True, unique=True)
    dataset_name = Column(String(32))
    # metadata
    pmid = Column(Text)
    title = Column(Text)
    summary = Column(Text)
    authors = Column(Text)
    # relationships to other tables
    clinical_infos = relationship("Patient", backref="dataset")
    dataset_genes = relationship("DatasetGene", backref="dataset")
