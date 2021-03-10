import os
import pandas as pd

os.makedirs('./results', exist_ok=True)

dataset_dfs = []

dataset_list = next(os.walk('./raw_data'))[1]

for index, dataset in enumerate(dataset_list):
    print(index, dataset)
    data_availability = pd.read_csv(
        f'./raw_data/{dataset}/cased_sequenced.csv', sep=';')

    clinical_data = pd.read_csv(
        f'./raw_data/{dataset}/CLIN.csv', sep=';')

    merged_df = pd.merge(clinical_data, data_availability,
                         on='patient', how='outer')

    # merged_df['patient_id'] = merged_df.index
    print(merged_df)
    dataset_list.append(merged_df)


# merged_df.insert(0, 'patient_id', merged_df.index)
# os.makedirs('./results', exist_ok=True)
# merged_df.to_csv('./results/patient.csv', sep=',', index=False)
