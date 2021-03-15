import os
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref, sessionmaker
from numpy import genfromtxt

# used to get values from .env file
from decouple import config

import base
import patient
import dataset
import gene
import dataset_gene

# processes csv data files


def Load_Data(file_name, dtypes):
    data = genfromtxt(file_name, delimiter=',', dtype=dtypes, names=True)
    return data.tolist()


engine = create_engine(config("CONN_STR"))
base.Base.metadata.create_all(engine, checkfirst=True)
# create a configured "Session" class
Session = sessionmaker(bind=engine)
# create a Session
session = Session()

try:
    # sample CSV file used:  http://www.google.com/finance/historical?q=NYSE%3AT&ei=W4ikVam8LYWjmAGjhoHACw&output=csv
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dataset_file = os.path.join(dir_path, "../seedfiles/dataset.csv")
    # data = Load_Data(dataset_file, [
    #     ('dataset_id', int), ('dataset_name', '>U12')])
    dataset_data = Load_Data(dataset_file, [int, '>U12'])
    for i in data:
        record = dataset_data.Dataset(**{
            'dataset_id': i[0],
            'dataset_name': i[1],
        })
        session.add(record)  # Add all the records
        print('Adding Dataset record')

    session.commit()  # Attempt to commit all the records
except:
    session.rollback()  # Rollback the changes on error
finally:
    session.close()  # Close the connection
print("Done")
