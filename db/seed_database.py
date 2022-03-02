import os
import pandas as pd
import numpy as np
import traceback
from .db import db
from .models import dataset_gene
from .models import gene
from .models import dataset
from .models import dataset_identifier
from .models import patient
from .models import signature_individual
from .models import signature_meta
from .models import signature_user_requested
from .models import signature_network
from .models import signature_kegg_network
from .models import analysis_request
from .models import predictio_result

# processes dataframes and creates respective table instances

def Add_Records(df, table):
    for index, row in df.iterrows():
        if table == 'dataset':
            record = dataset.Dataset(**{
                'dataset_id': int(row['dataset_id']),
                'dataset_name': row['dataset_name'],
                'pmid': row['pmid'] if str(row['pmid']) != 'nan' else '',
                'title': row['title'] if str(row['title']) != 'nan' else '',
                'summary': row['summary'] if str(row['summary']) != 'nan' else '',
                'authors': row['authors'] if str(row['authors']) != 'nan' else ''
            })
            print('Adding Dataset record ', index)
        elif table == 'dataset_identifier':
            record = dataset_identifier.DatasetIdentifier(**{
                'id': int(row['id']),
                'dataset_id': int(row['dataset_id']),
                'identifier': row['identifier'] if str(row['identifier']) != 'nan' else '',
                'link': row['link'] if str(row['link']) != 'nan' else ''
            })
            print('Adding DatasetIdentifier record ', index)
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
        elif table == 'signature_individual':
            record = signature_individual.Individual(**{
                'signature': row['signature'],
                'outcome': row['outcome'],
                'model': row['model'],
                'study': row['study'],
                'primary_tissue': row['Primary'],
                'sequencing': row['Sequencing'],
                'n': int(row['N']),
                'effect_size': float(row['Effect_size']),
                'se': float(row['SE']),
                '_95ci_low': float(row['95CI_low']),
                '_95ci_high': float(row['95CI_high']),
                'pval': float(row['Pval'])
            })
            print('Adding Individual Signature', index)
        elif table == 'signature_meta':
            record = signature_meta.Meta(**{
                'signature': row['signature'],
                'outcome': row['outcome'],
                'model': row['model'],
                'subgroup': row['Subgroup'],
                'tissue_type': row['Type'],
                'n': int(row['N']),
                'effect_size': float(row['Effect_size']) if row['Effect_size'] is not None else None,
                'se': float(row['SE']) if row['SE'] is not None else None,
                '_95ci_low': float(row['95CI_low']) if row['95CI_low'] is not None else None,
                '_95ci_high': float(row['95CI_high']) if row['95CI_high'] is not None else None,
                'pval': float(row['Pval']) if row['Pval'] is not None else None,
                'i2': float(row['I2']) if row['I2'] is not None else None,
                'pval_i2': float(row['Pval_I2']) if row['Pval_I2'] is not None else None
            })
            print('Adding Meta Signature', index)

        db.session.add(record)


def seed():
    try:
        # create tables
        db.create_all()

        # there might be an issue with SQLAlcemy closing the connection in the middle of data seeding
        # if all tables cannot be uploaded together, try loading tables separately
        dir_path = os.path.dirname(os.path.realpath(__file__))

        # populating signature_individual table
        sig_ind_file = os.path.join(
            dir_path, 'seedfiles/Signature_Individual.txt')
        sig_ind_data = pd.read_csv(sig_ind_file, sep='\t')
        sig_ind_data = pd.DataFrame(sig_ind_data, columns=[
            'signature',
            'signatureType',
            'outcome',
            'model',
            'study',
            'Primary',
            'Sequencing',
            'N',
            'Effect_size',
            'SE',
            '95CI_low',
            '95CI_high',
            'Pval'
        ])
        sig_ind_data = sig_ind_data.replace({np.nan: None})
        Add_Records(sig_ind_data, 'signature_individual')

        # populating signature_meta table
        sig_meta_file = os.path.join(
            dir_path, 'seedfiles/Signature_Meta_analysis.txt')
        sig_meta_data = pd.read_csv(sig_meta_file, sep='\t')
        sig_meta_data = pd.DataFrame(sig_meta_data, columns=[
            'signature',
            'signatureType',
            'outcome',
            'model',
            'Subgroup',
            'Type',
            'N',
            'Effect_size',
            'SE',
            '95CI_low',
            '95CI_high',
            'Pval',
            'I2',
            'Pval_I2'
        ])
        sig_meta_data = sig_meta_data.replace({np.nan: None})
        Add_Records(sig_meta_data, 'signature_meta')

        # populating dataset table
        dataset_file = os.path.join(dir_path, 'seedfiles/dataset.csv')
        dataset_data = pd.read_csv(
            dataset_file, quotechar='\"', skipinitialspace=True)
        Add_Records(dataset_data, 'dataset')

        # populating dataset_identifier table
        dataset_identifier_file = os.path.join(dir_path, 'seedfiles/dataset_identifier.csv')
        dataset_identifier_data = pd.read_csv(dataset_identifier_file, quotechar='\"', skipinitialspace=True)
        Add_Records(dataset_identifier_data, 'dataset_identifier')

        # populating gene table
        gene_file = os.path.join(dir_path, 'seedfiles/gene.csv')
        gene_data = pd.read_csv(
            gene_file, quotechar='\"', skipinitialspace=True, keep_default_na=False)
        Add_Records(gene_data, 'gene')

        # populating dataset_gene table
        dataset_gene_file = os.path.join(
            dir_path, 'seedfiles/dataset_gene.csv')
        dataset_gene_data = pd.read_csv(
            dataset_gene_file, quotechar='\"', skipinitialspace=True)
        Add_Records(dataset_gene_data, 'dataset_gene')

        # populating patient table
        patient_file = os.path.join(dir_path, 'seedfiles/patient.csv')
        patient_data = pd.read_csv(
            patient_file, quotechar='\"', skipinitialspace=True, keep_default_na=False)
        Add_Records(patient_data, 'patient')

        db.session.commit()  # Attempt to commit all the records
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
        db.session.rollback()  # Rollback the changes on error
    finally:
        print('Done')
        db.session.close()  # Close the connection

# used to create specific tables only
def create_table():
    try:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        # signature_individual.Individual.query.delete()
        # signature_meta.Meta.query.delete()
        # patient.Patient.query.delete()

        patient_file = os.path.join(dir_path, 'seedfiles/patient.csv')
        patient_data = pd.read_csv(
            patient_file, quotechar='\"', skipinitialspace=True, keep_default_na=False)
        Add_Records(patient_data, 'patient')

        # sig_ind_file = os.path.join(
        #     dir_path, 'seedfiles/Signature_Individual.txt')
        # sig_ind_data = pd.read_csv(sig_ind_file, sep='\t')
        # sig_ind_data = pd.DataFrame(sig_ind_data, columns=[
        #     'signature',
        #     'signatureType',
        #     'outcome',
        #     'model',
        #     'study',
        #     'Primary',
        #     'Sequencing',
        #     'N',
        #     'Effect_size',
        #     'SE',
        #     '95CI_low',
        #     '95CI_high',
        #     'Pval'
        # ])
        # sig_ind_data = sig_ind_data.replace({np.nan: None})
        # Add_Records(sig_ind_data, 'signature_individual')

        # sig_meta_file = os.path.join(
        #     dir_path, 'seedfiles/Signature_Meta_analysis.txt')
        # sig_meta_data = pd.read_csv(sig_meta_file, sep='\t')
        # sig_meta_data = pd.DataFrame(sig_meta_data, columns=[
        #     'signature',
        #     'signatureType',
        #     'outcome',
        #     'model',
        #     'Subgroup',
        #     'Type',
        #     'N',
        #     'Effect_size',
        #     'SE',
        #     '95CI_low',
        #     '95CI_high',
        #     'Pval',
        #     'I2',
        #     'Pval_I2'
        # ])
        # sig_meta_data = sig_meta_data.replace({np.nan: None})
        # Add_Records(sig_meta_data, 'signature_meta')

        db.session.commit()
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
    finally:
        print('Done')
        db.session.close()

# used to delete all rows from db tables.
def delete_table_rows():
    try:
        signature_individual.Individual.query.delete()
        signature_meta.Meta.query.delete()
        dataset_gene.DatasetGene.query.delete()
        patient.Patient.query.delete()
        gene.Gene.query.delete()
        dataset.Dataset.query.delete()
        db.session.commit()
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
        db.session.rollback()
    finally:
        print('Done')
        db.session.close()