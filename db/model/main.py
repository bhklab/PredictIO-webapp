from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref, sessionmaker

# used to get values from .env file
from decouple import config

import base

import clinical_info

engine = create_engine(config("CONN_STR"))
base.Base.metadata.create_all(engine, checkfirst=True)
Session = sessionmaker(bind=engine)
session = Session()
