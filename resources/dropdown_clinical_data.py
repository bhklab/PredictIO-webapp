from flask import request
from flask_restful import Resource
import traceback
from db.models.patient import Patient
from db.models.dataset_gene import DatasetGene
from db.models.dataset import Dataset

class ClinicalDataDropdown(Resource):
    def get(self, dropdown_type):
        result = {}
        status = 200

        query = {
            'genes': request.args.getlist('gene'),
            'datatype': request.args.get('datatype'),
            'sex': request.args.getlist('sex'),
            'primary': request.args.getlist('primary'),
            'drugtype': request.args.getlist('drugtype'),
            'sequencing': request.args.getlist('sequencing')
        }
        print(query)
        try:
            if(dropdown_type == 'datatype'):
                genes = request.args.getlist('gene')
                result = get_available_datatype(genes)
            else:
                result = get_downstream_dropdowns(query)
        except Exception as e:
            print('Exception ', e)
            print(traceback.format_exc())
            result = {"message": 'error occurred.'}
            status = 500
        finally:
            return result, status
    
    def post(self): 
        return  'Only post method is allowed', 400

def get_available_datatype(genes):
    # get joined database table to extract data from
    patient_list = DatasetGene.query\
        .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
        .add_columns(Patient.expression, Patient.cna, Patient.snv)
    filtered = filter_by_genes(patient_list, genes)
    filtered = filtered.all()

    dropdown = [
        {"label": "Expression", "value": "expression", "disabled": not any(item.expression == 1 for item in filtered)},
        {"label": "CNA", "value": "cna", "disabled": not any(item.cna == 1 for item in filtered)},
        {"label": "SNV", "value": "snv", "disabled": not any(item.snv == 1 for item in filtered)}
    ]

    return sorted(dropdown, key=lambda k: k["label"])

def get_downstream_dropdowns(query):
    # get joined database table to extract data from
    patient_list = get_joined_clinical_table()
    
    # perform filtering by selected genes and datatype
    filtered = filter_by_genes(patient_list, query['genes'])
    filtered = filter_by_datatype(filtered, query['datatype'])

    if(len(query['sex']) > 0):
        filtered = filter_by_sex(filtered, query['sex'])
    if(len(query['datatype']) > 0):
        filtered = filter_by_datatype(filtered, query['datatype'])
    if(len(query['primary']) > 0):
        filtered = filter_by_primary(filtered, query['primary'])
    if(len(query['drugtype']) > 0):
        filtered = filter_by_drugtype(filtered, query['drugtype'])
    if(len(query['sequencing']) > 0):
        filtered = filter_by_sequencing(filtered, query['sequencing'], query['datatype'])
    
    filtered = filtered.all()

    # sex dropdown
    sex = set([p.sex for p in filtered if len(p.sex) > 0])
    sex = list(map((lambda item: {'label': 'Female' if item == 'F' else 'Male', 'value': item}), sex))
    
    # primary dropdown
    tissues = set([p.primary_tissue for p in filtered if len(p.primary_tissue) > 0 and p.primary_tissue != 'Unknown' and p.primary_tissue != 'Other'])
    tissues = list(map((lambda item: {'label': item, 'value': item}), tissues))
    
    # drugtype dropdown
    drugtypes = set([p.drug_type for p in filtered if len(p.drug_type) > 0])
    drugtypes = list(map((lambda item: {'label': item, 'value': item}), drugtypes))
    
    # sequencing dropdown
    sequencing = []
    if(query['datatype'] == 'expression'):
        sequencing = set([p.rna for p in filtered if len(p.rna) > 0])
    else:
        sequencing = set([p.dna for p in filtered if len(p.dna) > 0])
    sequencing = list(map((lambda item: {'label': item.upper(), 'value': item.upper()}), sequencing))
    
    # dataset dropdown
    dataset = set([p.dataset_name for p in filtered])
    dataset = list(map((lambda item: {'label': item, 'value': item}), dataset))

    return(
        {
            "sex": sorted(sex, key=lambda k: k["label"]),
            "primary": sorted(tissues, key=lambda k: k["label"]),
            "drugtype": sorted(drugtypes, key=lambda k: k["label"]),
            "sequencing": sorted(sequencing, key=lambda k: k["label"]),
            "study": sorted(dataset, key=lambda k: k["label"])
        }
    )

def get_joined_clinical_table():
    # get joined database table to extract data from
    join_table = DatasetGene.query\
        .join(Dataset, DatasetGene.dataset_id == Dataset.dataset_id)\
        .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
        .add_columns(
            Patient.sex,
            Patient.primary_tissue,
            Patient.drug_type,
            Patient.rna,
            Patient.dna,
            Dataset.dataset_name
        )
    
    return join_table

def filter_by_genes(filtered, genes):
    return filtered.filter(DatasetGene.gene_id.in_(genes))

def filter_by_datatype(filtered, datatype):
    if(datatype == 'expression'):
        return filtered.filter(Patient.expression == 1)
    elif(datatype == 'cna'):
        return filtered.filter(Patient.cna == 1)
    elif(datatype == 'snp'):
        return filtered.filter(Patient.snv == 1)

def filter_by_sex(filtered, sex):
    return filtered.filter(Patient.sex.in_(sex))

def filter_by_primary(filtered, primary):
    return filtered.filter(Patient.primary_tissue.in_(primary))

def filter_by_drugtype(filtered, drugtype):
    return filtered.filter(Patient.drug_type.in_(drugtype))

def filter_by_sequencing(filtered, sequencing, datatype):
    if(datatype == 'expression'):
        return filtered.filter(Patient.rna.in_(sequencing))
    else:
        return filtered.filter(Patient.dna.in_(sequencing))
