from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey
from .base import Base


class Patient(Base):
    __tablename__ = "patient"
    patient_id = Column(Integer, primary_key=True, index=True, unique=True)
    dataset_id = Column(Integer, ForeignKey("dataset.dataset_id"))
    age = Column(Integer)
    patient = Column(String(32))
    sex = Column(String(32))
    primary_tissue = Column(String(32))
    histo = Column(String(32))
    stage = Column(String(32))
    response_other_info = Column(String(32))
    recist = Column(String(32))
    response = Column(String(32))
    drug_type = Column(String(32))
    dna = Column(String(32))
    rna = Column(String(32))
    expression = Column(Integer)
    cna = Column(Integer)
    snv = Column(Integer)
