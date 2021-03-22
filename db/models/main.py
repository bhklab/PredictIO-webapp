import os
import pandas as pd
import numpy as np
import traceback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# used to get values from .env file
from decouple import config

import base
import patient
import dataset
import gene
import dataset_gene


engine = create_engine(config("CONN_STR"), pool_recycle=21600)
base.Base.metadata.create_all(engine, checkfirst=True)
# create a configured "Session" class
Session = sessionmaker(bind=engine)
# create a Session
session = Session()
