from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from base import Base


class ClinicalInfo(Base):
    __tablename__ = "clinical_info"
    patient_id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer, primary_key=True)
    age = Column(Integer)
    sex = Column(String(32))
