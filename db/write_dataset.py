'''
CURRENTLY UNUSED
'''

import pandas as pd 
import pymysql
from decouple import config
import os

os.chdir('/Users/minorunakano/Documents/GitHub/IOdb/db')

# Read CSV
dataset = pd.read_csv('seedfiles/csv/dataset.csv')
df = pd.DataFrame(dataset, columns= ["dataset_id", 'expr', 'cna', 'snv'])

# Connect to MySQL server
db = pymysql.connect(
                      config('DB_HOST'),
                      config('DB_USER'),
                      config('DB_PASS'),
                      config('DB_NAME')
                    )
cursor = db.cursor()

# # # Insert DataFrame to Table
for row in df.itertuples():
    sql = "INSERT INTO dataset \
        (dataset_id, expr, cna, snv) \
        VALUES ('%s', '%d', '%d', '%d')" % \
        (row.dataset_id, row.expr, row.cna, row.snv)
    cursor.execute(sql)
db.commit()

db.close()