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

        # find unique gene - dataset combination based on the search text and selected datatype
        filtered = DatasetGene.query\
            .join(Gene, DatasetGene.gene_id == Gene.gene_id)\
            .join(Patient, DatasetGene.dataset_id == Patient.dataset_id)\
            .add_columns(Gene.gene_id, Gene.gene_name, Patient.patient_id, Patient.expression, Patient.cna, Patient.snv)\
            .filter(Gene.gene_name.ilike('{0}%'.format(query), getattr(Patient, datatype) == 1))\
            .group_by(Gene.gene_id, DatasetGene.dataset_id)\
            .order_by(Gene.gene_name)\
            .all()
        
        # return only the genes that are presetn in 3 datasets or more.
        filtered_genes = []
        gene_ids = list(map((lambda item: item.gene_id), filtered))
        for gene in set(gene_ids):
            if gene_ids.count(gene) >= 3:
                found = find_one(lambda x,id: x.gene_id == id, gene, filtered)
                filtered_genes.append({'gene_id': found.gene_id, 'gene_name': found.gene_name})

        return filtered_genes, 200
    
    def post(self): 

        return  'Only post method is allowed', 400

def find_one(pred, gene_id, iterable):
    for item in iterable:
        if pred(item, gene_id):
            return item
    return None