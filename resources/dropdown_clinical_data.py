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

        try:
            if(dropdown_type == 'datatype'):
                genes = request.args.getlist('gene')
                result = get_available_datatype(genes)
            elif(dropdown_type == 'sex'):
                genes = request.args.getlist('gene')
                datatype = request.args.get('datatype')
                result = get_available_sex(genes, datatype)
            elif(dropdown_type == 'primary'):
                genes = request.args.getlist('gene')
                datatype = request.args.get('datatype')
                sex = request.args.getlist('sex')
                result = get_available_primary_tissue(genes, datatype, sex)
            elif(dropdown_type == 'drugtype'):
                genes = request.args.getlist('gene')
                datatype = request.args.get('datatype')
                sex = request.args.getlist('sex')
                primary = request.args.getlist('primary')
                result = get_available_drugtype(genes, datatype, sex, primary)
            elif(dropdown_type == 'sequencing'):
                genes = request.args.getlist('gene')
                datatype = request.args.get('datatype')
                sex = request.args.getlist('sex')
                primary = request.args.getlist('primary')
                drugtype = request.args.getlist('drugtype')
                result = get_available_sequencing_type(genes, datatype, sex, primary, drugtype)
            elif(dropdown_type == 'study'):
                genes = request.args.getlist('gene')
                datatype = request.args.get('datatype')
                sex = request.args.getlist('sex')
                primary = request.args.getlist('primary')
                drugtype = request.args.getlist('drugtype')
                sequencing = request.args.getlist('sequencing')
                result = get_available_datasets(genes, datatype, sex, primary, drugtype, sequencing)
            else:
                result = {}

            result = sorted(result, key=lambda k: k["label"])
            
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
    datatype = {"disableExp": True, "disableCNA": True, "disableSNV": True}

    # get joined database table to extract data from
    patient_list = DatasetGene.query\
        .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
        .add_columns(
            Patient.expression.label("expression"), 
            Patient.cna.label("cna"), 
            Patient.snv.label("snv"))

    filtered = filter_by_genes(patient_list, genes)

    for patient in filtered.all():
            if patient.expression == 1:
                datatype["disableExp"] = False
            if patient.cna == 1:
                datatype["disableCNA"] = False
            if patient.snv == 1:
                datatype["disableSNV"] = False
            
            if(not datatype["disableExp"] and not datatype["disableCNA"] and not datatype["disableSNV"]):
                break

    result = [
        {"label": "Expression", "value": "expression", "disabled": datatype["disableExp"]},
        {"label": "CNA", "value": "cna", "disabled": datatype["disableCNA"]},
        {"label": "SNV", "value": "snv", "disabled": datatype["disableSNV"]}
    ]

    return result

def get_available_sex(genes, datatype):
    sex = {"disableMale": True, "disableFemale": True}

    # get joined database table to extract data from
    patient_list = DatasetGene.query\
        .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
        .add_columns(Patient.sex.label("sex"))

    # perform filtering
    filtered = filter_by_genes(patient_list, genes)
    filtered = filter_by_datatype(filtered, datatype)
    
    # enable each dropdown option if it exists in filtered data
    for patient in filtered.all():
        if patient.sex == "M":
            sex["disableMale"] = False
        if patient.sex == "F":
            sex["disableFemale"] = False
        if(not sex["disableMale"] and not sex["disableFemale"]):
            break
    
    result = [
        {"label": "Male", "value": "M", "disabled": sex["disableMale"]},
        {"label": "Female", "value": "F", "disabled": sex["disableFemale"]},
    ]

    return result

def get_available_primary_tissue(genes, datatype, sex):

    # get joined database table to extract data from
    patient_list = DatasetGene.query\
        .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
        .add_columns(Patient.primary_tissue)
    
    # perform filtering
    filtered = filter_by_genes(patient_list, genes)
    filtered = filter_by_datatype(filtered, datatype)
    filtered = filter_by_sex(filtered, sex)

    tissues = set([p.primary_tissue for p in filtered.all() if p.primary_tissue != 'Unknown' and p.primary_tissue != 'Other'])

    result = []
    for tissue in tissues:
        result.append({"label": tissue, "value": tissue})

    return result

def get_available_drugtype(genes, datatype, sex, primary):
    # get joined database table to extract data from
    patient_list = DatasetGene.query\
        .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
        .add_columns(Patient.drug_type)
    
    # perform filtering
    filtered = filter_by_genes(patient_list, genes)
    filtered = filter_by_datatype(filtered, datatype)
    filtered = filter_by_sex(filtered, sex)
    filtered = filter_by_primary(filtered, primary)

    drugtypes = set([p.drug_type for p in filtered.all()])

    result = []
    for drugtype in drugtypes:
        result.append({"label": drugtype, "value": drugtype})

    return result

def get_available_sequencing_type(genes, datatype, sex, primary, drug_type):
    # get joined database table to extract data from
    patient_list = DatasetGene.query.join(Dataset, DatasetGene.dataset_id == Dataset.dataset_id)
    if(datatype == 'expression'):
        patient_list = patient_list.add_columns(Patient.rna)
    else:
        patient_list = patient_list.add_columns(Patient.dna)
    
    # perform filtering
    filtered = filter_by_genes(patient_list, genes)
    filtered = filter_by_datatype(filtered, datatype)
    filtered = filter_by_sex(filtered, sex)
    filtered = filter_by_primary(filtered, primary)
    filtered = filter_by_drugtype(filtered, drug_type)

    sequencing = []
    if(datatype == 'expression'):
        sequencing = set([p.rna for p in filtered.all()])
    else:
        sequencing = set([p.dna for p in filtered.all()])
    
    result = []
    for seq in sequencing:
        result.append({"label": seq.upper(), "value": seq})
    
    return result

def get_available_datasets(genes, datatype, sex, primary, drug_type, sequencing):
    # get joined database table to extract data from
    patient_list = DatasetGene.query\
        .join(Dataset, DatasetGene.dataset_id == Dataset.dataset_id)\
            .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
                .add_columns(Dataset.dataset_name)
    
    # perform filtering
    filtered = filter_by_genes(patient_list, genes)
    filtered = filter_by_datatype(filtered, datatype)
    filtered = filter_by_sex(filtered, sex)
    filtered = filter_by_primary(filtered, primary)
    filtered = filter_by_drugtype(filtered, drug_type)
    filtered = filter_by_sequencing(filtered, sequencing, datatype)

    dataset = set([p.dataset_name for p in filtered.all()])
    result = []
    for data in dataset:
        result.append({"label": data, "value": data})

    return result 

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
