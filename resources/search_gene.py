from flask import request
from flask_restful import Resource
from db.models.gene import Gene

class SearchGene(Resource):
    def get(self):
        
        # parse request
        query = request.args.get('query')

        # query the genes table
        genes = Gene.query.filter(Gene.gene_name.ilike('{0}%'.format(query)))
        result = Gene.serialize_list(genes.all())

        return result, 200
    
    def post(self): 

        return  'Only post method is allowed', 400