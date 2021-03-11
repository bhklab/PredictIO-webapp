import os
import pandas as pd
from pathlib import Path

patient_dfs = []
datasets = []
all_genes = []
dataset_gene_dict = {}

# processes individula datasets
dataset_list = next(os.walk('./raw_data'))[1]
for index, dataset in enumerate(dataset_list):
    dataset_index = index + 1
    print(dataset, f'({dataset_index}/{len(dataset_list)})')
    datasets.append(dataset)
    # merges cased_sequenced and clin files together to create dataset data for the patient table
    data_availability = pd.read_csv(
        f'./raw_data/{dataset}/cased_sequenced.csv', sep=';')
    clinical_data = pd.read_csv(
        f'./raw_data/{dataset}/CLIN.csv', sep=';')
    clinical_df = pd.merge(clinical_data, data_availability,
                           on='patient', how='outer')
    clinical_df.insert(0, 'dataset_id', dataset_index)
    # adds merged dataset dataframe to the list of other datasets
    patient_dfs.append(clinical_df)
    # initalizes dataset list in the dictionary
    dataset_gene_dict[dataset_index] = []
    # attempts to read cna, snv and expression files to collect gene data
    cna_file = Path(f'./raw_data/{dataset}/CNA_gene.csv.gz')
    snv_file = Path(f'./raw_data/{dataset}/SNV.csv.gz')
    expr_file = Path(f'./raw_data/{dataset}/EXPR.csv.gz')
    if cna_file.is_file():
        cna_df = pd.read_csv(cna_file, compression='gzip', sep=';')
        cna_genes = cna_df.index.tolist()
        dataset_gene_dict[dataset_index].extend(cna_genes)
        all_genes.extend(cna_genes)
    if snv_file.is_file():
        snv_df = pd.read_csv(snv_file, compression='gzip', sep=';')
        snv_genes = snv_df['Gene'].tolist()
        dataset_gene_dict[dataset_index].extend(snv_genes)
        all_genes.extend(snv_genes)
    if expr_file.is_file():
        expr_df = pd.read_csv(expr_file, compression='gzip', sep=';')
        expr_genes = expr_df.index.tolist()
        dataset_gene_dict[dataset_index].extend(expr_genes)
        all_genes.extend(expr_genes)
    # removes duplicated gene entries from dataset list
    dataset_gene_dict[dataset_index] = list(
        set(dataset_gene_dict[dataset_index]))

# removes duplicated gene entries and creates gene dictionary
gene_list = list(set(all_genes))
gene_dict = {k: v + 1 for v, k in enumerate(gene_list)}
# creates dataframes that represent final versions of the tables
patient_table = pd.concat(patient_dfs, ignore_index=True)
dataset_table = pd.DataFrame(datasets, columns=['dataset_name'])
gene_table = pd.DataFrame(gene_list, columns=['gene_name'])
# creates data rows from dataset_gene_dict lists and converts gene_names there to respective gene_ids
dataset_gene_table = pd.DataFrame([(key, gene_dict[var]) for (key, L) in dataset_gene_dict.items() for var in L],
                                  columns=['dataset_id', 'gene_id'])
# adds primary key column to table dataframes
dataset_table.insert(0, 'dataset_id', dataset_table.index + 1)
patient_table.insert(0, 'patient_id', patient_table.index + 1)
gene_table.insert(0, 'gene_id', gene_table.index + 1)
dataset_gene_table.insert(0, 'id', dataset_gene_table.index + 1)
# creates csv files for the database
os.makedirs('./results', exist_ok=True)
dataset_table.to_csv('./results/dataset.csv', sep=',', index=False)
patient_table.to_csv('./results/patient.csv', sep=',', index=False)
gene_table.to_csv('./results/gene.csv', sep=',', index=False)
dataset_gene_table.to_csv('./results/dataset_gene.csv', sep=',', index=False)
