import os
import pandas as pd
from pathlib import Path
import json

patient_dfs = []
datasets = []
all_genes = []
dataset_gene_dict = {}
dataset_dict = {
    'dataset_name': [],
    'pmid': [],
    'title': [],
    'summary': [],
    'authors': []
}

# reads dataset description from a separate file
with open('./raw_data/description.json') as f:
    dataset_metadata = json.load(f)

# processes individula datasets
dataset_list = next(os.walk('./raw_data/datasets'))[1]
for index, dataset in enumerate(dataset_list):
    dataset_index = index + 1
    print(dataset, f'({dataset_index}/{len(dataset_list)})')
    dataset_dict['dataset_name'].append(dataset)
    # checks if there is any description information for the dataset
    description_match_found = False
    for description_index, dataset_description in enumerate(dataset_metadata):
        if dataset_description['study'] == dataset:
            description_match_found = True
            dataset_dict['pmid'].append(dataset_description['pmid'])
            dataset_dict['title'].append(dataset_description['title'])
            dataset_dict['summary'].append(dataset_description['summary'])
            dataset_dict['authors'].append(dataset_description['authors'])
        #  in case there is no metadata for a given dataset
        if not description_match_found and len(dataset_metadata) == description_index + 1:
            dataset_dict['pmid'].append('')
            dataset_dict['title'].append('')
            dataset_dict['summary'].append('')
            dataset_dict['authors'].append('')
    # merges cased_sequenced and clin files together to create dataset data for the patient table
    data_availability = pd.read_csv(
        f'./raw_data/datasets/{dataset}/cased_sequenced.csv', sep=';')
    clinical_data = pd.read_csv(
        f'./raw_data/datasets/{dataset}/CLIN.csv', sep=';')
    clinical_df = pd.merge(clinical_data, data_availability,
                           on='patient', how='outer')
    clinical_df.insert(0, 'dataset_id', dataset_index)
    # adds merged dataset dataframe to the list of other datasets
    patient_dfs.append(clinical_df)
    # initalizes dataset list in the dictionary
    dataset_gene_dict[dataset_index] = []
    # attempts to read cna, snv and expression files to collect gene data
    cna_file = Path(f'./raw_data/datasets/{dataset}/CNA_gene.csv.gz')
    snv_file = Path(f'./raw_data/datasets/{dataset}/SNV.csv.gz')
    expr_file = Path(f'./raw_data/datasets/{dataset}/EXPR.csv.gz')
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
        expr_df = pd.read_csv(
            expr_file, compression='gzip', encoding='latin1', sep=';')
        expr_genes = expr_df.index.tolist()
        dataset_gene_dict[dataset_index].extend(expr_genes)
        all_genes.extend(expr_genes)
    # removes duplicated and empty gene entries from dataset list
    unique_genes = filter(lambda x: str(x) != 'nan', list(
        set(dataset_gene_dict[dataset_index])))
    dataset_gene_dict[dataset_index] = unique_genes

# removes duplicated and empty gene entries and creates gene dictionary
gene_list = list(filter(lambda x: str(x) != 'nan', list(set(all_genes))))
gene_dict = {k: v + 1 for v, k in enumerate(gene_list)}
# creates dataframes that represent final versions of the tables
patient_table = pd.concat(patient_dfs, ignore_index=True)
dataset_table = pd.DataFrame(dataset_dict)
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
os.makedirs('./db/seedfiles', exist_ok=True)
dataset_table.to_csv('./db/seedfiles/dataset.csv', sep=',', index=False)
patient_table.to_csv('./db/seedfiles/patient.csv', sep=',', index=False)
gene_table.to_csv('./db/seedfiles/gene.csv', sep=',', index=False)
dataset_gene_table.to_csv(
    './db/seedfiles/dataset_gene.csv', sep=',', index=False)
