'''
CURRENTLY UNUSED
'''

import pandas as pd 
import numpy as np
import pymysql
from decouple import config
import os

os.chdir('/Users/minorunakano/Documents/GitHub/IOdb/db')

# Read CSV
data = pd.read_csv('seedfiles/csv/clinical_info.csv')
df = pd.DataFrame(data, columns= [
    "dataset_id", 
    "patient", 
    "sex", 
    "age", 
    "primary_tissue", 
    "histo", 
    "stage", 
    "response_other_info", 
    "recist", 
    "response", 
    "drug_type", 
    "dna", 
    "rna", 
    'expr', 
    'cna', 
    'snv'
    ])

# df = df.replace({np.nan: None})

# # # # Connect to MySQL server
# db = pymysql.connect(
#                       config('DB_HOST'),
#                       config('DB_USER'),
#                       config('DB_PASS'),
#                       config('DB_NAME')
#                     )
# cursor = db.cursor()

# # # # # # # Insert DataFrame to Table
# for row in df.itertuples():
#     query = """
#     INSERT INTO clinical_info 
#         (dataset_id, patient, sex, age, primary_tissue, histo, stage, response_other_info, recist, response, drug_type, dna, rna, expr, cna, snv) \
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#     """
#     values = (
#         row.dataset_id, 
#         row.patient, 
#         row.sex, 
#         row.age, 
#         row.primary_tissue, 
#         row.histo, 
#         row.stage, 
#         row.response_other_info, 
#         row.recist, 
#         row.response, 
#         row.drug_type, 
#         row.dna, 
#         row.rna, 
#         row.expr, 
#         row.cna, 
#         row.snv
#     )

#     cursor.execute(query, values)
# db.commit()

# db.close()