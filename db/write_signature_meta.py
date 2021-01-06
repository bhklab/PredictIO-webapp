import pandas as pd 
import numpy as np
import pymysql
from decouple import config
import os

# Reads 'signature_meta.txt' seed file and populates 'signature_meta table

os.chdir('/Users/minorunakano/Documents/GitHub/IOdb/db')

# Read CSV
data = pd.read_csv('seedfiles/signatures/signature_meta.txt', sep='\t')
df = pd.DataFrame(data, columns= [
        "signature",
        "outcome",
        "model",
        "Subgroup",
        "Type",
        "N",
        "Effect_size",
        "SE",
        "95CI_low",
        "95CI_high",
        "Pval",
        "I2",
        "Pval_I2"
    ])
df = df.replace({np.nan: None})
df.rename(columns={'95CI_low':'ci95_low', '95CI_high':'ci95_high'}, inplace=True)

# # # Connect to MySQL server
db = pymysql.connect(
                      config('DB_HOST'),
                      config('DB_USER'),
                      config('DB_PASS'),
                      config('DB_NAME')
                    )
cursor = db.cursor()

# # # # # # Insert DataFrame to Table
for row in df.itertuples():
    query = """
    INSERT INTO signature_meta
        (signature, outcome, model, subgroup, tissue_type, n, effect_size, se, _95ci_low, _95ci_high, pval, i2, pval_i2) \
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        row.signature, 
        row.outcome, 
        row.model, 
        row.Subgroup, 
        row.Type, 
        row.N, 
        row.Effect_size, 
        row.SE, 
        row.ci95_low, 
        row.ci95_high, 
        row.Pval,
        row.I2,
        row.Pval_I2
    )

    cursor.execute(query, values)
db.commit()

db.close()