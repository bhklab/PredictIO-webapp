import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
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


def Add_Records(data, type):
    print(type)
    for index, row in enumerate(data):
        if type == 'dataset':
            record = dataset.Dataset(**{
                'dataset_id': row[0],
                'dataset_name': row[1],
            })
            print('Adding Dataset record ', index)
        elif type == 'dataset_gene':
            record = dataset_gene.DatasetGene(**{
                'id': row[0],
                'dataset_id': row[1],
                'gene_id': row[2],
            })
            print('Adding DatasetGene record', index)
        elif type == 'gene':
            record = dataset_gene.DatasetGene(**{
                'gene_id': row[0],
                'gene_name': row[1]
            })
            print('Adding Gene record', index)
        session.add(record)


try:
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dataset_file = os.path.join(dir_path, "../seedfiles/dataset.csv")
    dataset_data = Load_Data(dataset_file, [int, '>U12'])
    Add_Records(dataset_data, 'dataset')
    gene_file = os.path.join(dir_path, "../seedfiles/gene.csv")
    gene_data = Load_Data(gene_file, [int, '>U100'])
    Add_Records(gene_data, 'gene')
    dataset_gene_file = os.path.join(dir_path, "../seedfiles/dataset_gene.csv")
    dataset_gene_data = Load_Data(dataset_gene_file, [int, int, int])
    Add_Records(dataset_gene_data, 'dataset_gene')
    session.commit()  # Attempt to commit all the records
except:
    session.rollback()  # Rollback the changes on error
finally:
    session.close()  # Close the connection
print("Done")
