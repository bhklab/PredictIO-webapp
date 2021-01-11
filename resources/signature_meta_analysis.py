import math
from flask import Flask, request
from flask_restful import Resource, reqparse
from models.signature_meta import Meta

# Route used to submit request for the "Explore" pipeline

class SignatureMetaAnalysis(Resource):
    
    def get(self):
        return "Only post method is allowed", 400
    
    def post(self):
        print("Submitting the explore request.")
        
        # parse request
        query = request.get_json()

        # fetch data from the database
        result = []
        meta = Meta.query.filter(Meta.outcome == query['outcome'], Meta.model == query['model'], Meta.n > 3).all()
        result = Meta.serialize_list(meta)
        
        for item in result:
            item['logPval'] = -math.log10(item['pval'])

        # parse and return the output data 
        return result, 200