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

# processes dataframes and creates respective table instances


def Add_Records(df, table):
    print(df)
    for index, row in df.iterrows():
        if table == 'dataset':
            record = dataset.Dataset(**{
                'dataset_id': int(row['dataset_id']),
                'dataset_name': row['dataset_name'],
            })
            print('Adding Dataset record ', index)
        elif table == 'dataset_gene':
            record = dataset_gene.DatasetGene(**{
                'id': int(row['id']),
                'dataset_id': int(row['dataset_id']),
                'gene_id': int(row['gene_id']),
            })
            print('Adding DatasetGene record', index)
        elif table == 'gene':
            record = gene.Gene(**{
                'gene_id': int(row['gene_id']),
                'gene_name': row['gene_name']
            })
            print('Adding Gene record', index)
        elif table == 'patient':
            record = patient.Patient(**{
                'patient_id': int(row['patient_id']),
                'dataset_id': int(row['dataset_id']),
                'age': row['age'],
                'patient': row['patient'],
                'sex': row['sex'],
                'primary_tissue': row['primary'],
                'histo': row['histo'],
                'stage': row['stage'],
                'response_other_info': row['response.other.info'],
                'recist': row['recist'],
                'response': row['response'],
                'drug_type': row['drug_type'],
                'dna': row['dna'],
                'rna': row['rna'],
                'snv': int(float(row['snv'])) if row['snv'] != '' else 0,
                'cna': int(float(row['cna'])) if row['cna'] != '' else 0,
                'expression': int(float(row['expr'])) if row['expr'] != '' else 0
            })
            print('Adding Patient', index)
        session.add(record)


try:
    dir_path = os.path.dirname(os.path.realpath(__file__))
    # populating dataset table
    dataset_file = os.path.join(dir_path, "../seedfiles/dataset.csv")
    dataset_data = pd.read_csv(
        dataset_file, quotechar='"', skipinitialspace=True)
    Add_Records(dataset_data, 'dataset')
    # populating gene table
    gene_file = os.path.join(dir_path, "../seedfiles/gene.csv")
    gene_data = pd.read_csv(
        gene_file, quotechar='"', skipinitialspace=True, keep_default_na=False)
    Add_Records(gene_data, 'gene')
    # populating dataset_gene table
    dataset_gene_file = os.path.join(dir_path, "../seedfiles/dataset_gene.csv")
    dataset_gene_data = pd.read_csv(
        dataset_gene_file, quotechar='"', skipinitialspace=True)
    Add_Records(dataset_gene_data, 'dataset_gene')
    # populating patient table
    patient_file = os.path.join(dir_path, "../seedfiles/patient.csv")
    patient_data = pd.read_csv(
        patient_file, quotechar='"', skipinitialspace=True, keep_default_na=False)
    Add_Records(patient_data, 'patient')
    session.commit()  # Attempt to commit all the records
except Exception as e:
    print('Exception ', e)
    print(traceback.format_exc())
    session.rollback()  # Rollback the changes on error
finally:
    print("Done")
    session.close()  # Close the connection
