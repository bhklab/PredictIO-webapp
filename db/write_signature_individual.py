import pandas as pd 
import numpy as np
import pymysql
from decouple import config
import os

# Reads 'signature_individual.txt' seed file and populates 'signature_individual table

os.chdir('/Users/minorunakano/Documents/GitHub/IOdb/db')

# Read CSV
data = pd.read_csv('seedfiles/signatures/signature_individual.txt', sep='\t')
df = pd.DataFrame(data, columns= [
        "signature",
        "outcome",
        "model",
        "study",
        "Primary",
        "Sequencing",
        "N",
        "Effect_size",
        "SE",
        "95CI_low",
        "95CI_high",
        "Pval",
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
    INSERT INTO signature_individual
        (signature, outcome, model, study, primary_tissue, sequencing, n, effect_size, se, ci95_low, ci95_high, pval) \
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        row.signature, 
        row.outcome, 
        row.model, 
        row.study, 
        row.Primary, 
        row.Sequencing, 
        row.N, 
        row.Effect_size, 
        row.SE, 
        row.ci95_low, 
        row.ci95_high, 
        row.Pval
    )

    cursor.execute(query, values)
db.commit()

db.close()