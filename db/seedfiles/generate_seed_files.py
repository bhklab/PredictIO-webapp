import os
import pandas as pd

patient_dfs = []
datasets = []

dataset_list = next(os.walk('./raw_data'))[1]

for index, dataset in enumerate(dataset_list):
    print(index, dataset)
    datasets.append(dataset)
    data_availability = pd.read_csv(
        f'./raw_data/{dataset}/cased_sequenced.csv', sep=';')

    clinical_data = pd.read_csv(
        f'./raw_data/{dataset}/CLIN.csv', sep=';')

    merged_df = pd.merge(clinical_data, data_availability,
                         on='patient', how='outer')
    merged_df.insert(0, 'dataset_id', index + 1)
    patient_dfs.append(merged_df)

patient_table = pd.concat(patient_dfs, ignore_index=True)
dataset_table = pd.DataFrame(datasets, columns=['dataset_name'])

dataset_table.insert(0, 'dataset_id', dataset_table.index + 1)
patient_table.insert(0, 'patient_id', patient_table.index + 1)
os.makedirs('./results', exist_ok=True)
dataset_table.to_csv('./results/dataset.csv', sep=',', index=False)
patient_table.to_csv('./results/patient.csv', sep=',', index=False)
