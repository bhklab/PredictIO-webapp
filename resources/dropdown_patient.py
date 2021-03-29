from flask import request
from flask_restful import Resource
from db.models.patient import Patient
from db.models.dataset_gene import DatasetGene

class PatientDataType(Resource):
    def get(self):

        datatype = {
            "exp": True,
            "cna": True,
            "snv": True
        }
        
        # parse request
        genes = request.args.getlist('gene')
        patient_list = DatasetGene.query\
            .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
            .add_columns(
                DatasetGene.gene_id.label("gene_id"), 
                DatasetGene.dataset_id.label("dataset_id"), 
                Patient.patient_id.label("patient_id"), 
                Patient.expression.label("expression"), 
                Patient.cna.label("cna"), 
                Patient.snv.label("snv"))\
                    .filter(DatasetGene.gene_id.in_(genes)).all()
        
        for patient in patient_list:
            # print("{}-{}-{}-{}".format(patient.patient_id, patient.expression, patient.cna, patient.snv))
            if patient.expression == 1:
                datatype["exp"] = False
            if patient.cna == 1:
                datatype["cna"] = False
            if patient.snv == 1:
                datatype["snv"] = False
            
            if(datatype["exp"] and datatype["cna"] and datatype["snv"]):
                break

        result =[
            {"label": "Expression", "value": "expression", "disabled": datatype["exp"]},
            {"label": "CNA", "value": "cna", "disabled": datatype["cna"]},
            {"label": "SNV", "value": "snv", "disabled": datatype["snv"]}
        ]
        return result, 200
    
    def post(self): 

        return  'Only post method is allowed', 400