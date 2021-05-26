from flask import request
from flask_restful import Resource
from db.models.gene import Gene
from db.models.patient import Patient
from db.models.dataset_gene import DatasetGene

class SearchGene(Resource):
    def get(self, datatype):
        print(datatype)
        # parse request
        query = request.args.get('query')

        filtered = DatasetGene.query.group_by(Gene.gene_id)\
            .join(Gene, DatasetGene.gene_id == Gene.gene_id)\
            .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
            .add_columns(Gene.gene_id, Gene.gene_name, Patient.expression, Patient.cna, Patient.snv)\
            .filter(Gene.gene_name.ilike('{0}%'.format(query)))\
            .order_by(Gene.gene_name)\
            .all()
        
        if(datatype == 'expression'):
            filtered = [item for item in filtered if item.expression == 1]
        elif(datatype == 'cna'):
            filtered = [item for item in filtered if item.cna == 1]
        elif(datatype == 'snv'):
            filtered = [item for item in filtered if item.snv == 1]
        
        genes = list(map((lambda item: {'gene_id': item.gene_id, 'gene_name': item.gene_name}), filtered))

        return genes, 200
    
    def post(self): 

        return  'Only post method is allowed', 400