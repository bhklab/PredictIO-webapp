'''
CURRENTLY UNUSED
'''

import pandas as pd 
import pymysql
from decouple import config
import os

os.chdir('/Users/minorunakano/Documents/GitHub/IOdb/db')

# Read CSV
gene = pd.read_csv('seedfiles/csv/gene.csv')
df = pd.DataFrame(gene, columns= ["gene_id"])

# Connect to MySQL server
db = pymysql.connect(
                      config('DB_HOST'),
                      config('DB_USER'),
                      config('DB_PASS'),
                      config('DB_NAME')
                    )
cursor = db.cursor()

# # # # Insert DataFrame to Table
# query = "LOAD DATA INFILE 'seedfiles/csv/gene.csv' INTO TABLE gene FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES"
# # values = []
# # for row in df.itertuples():
# #     query = """
# #         INSERT INTO gene (gene_id) VALUES (%s)
# #         """
# #     values.append((row.gene_id))

# # cursor.executemany(query, values)
# cursor.execute(query)
# db.commit()

db.close()