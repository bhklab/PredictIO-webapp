from flask import Flask, request
from flask_restful import Resource, reqparse
from models.signature_individual import Individual
from models.signature_meta import Meta

# Route used to submit request for the "Explore" pipeline

class Explore(Resource):
    
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str, help='signature table type')
        args = parser.parse_args()
        
        result = []
        if(args.type == 'individual'):
            individuals = Individual.query.limit(10).all()
            result = Individual.serialize_list(individuals)
        elif(args.type == 'meta'):
            meta = Meta.query.all()
            result = Meta.serialize_list(meta)
        
        return result, 200
    
    def post(self):
        print("Submitting the explore request.")
        
        # parse request
        query = request.get_json()

        # fetch data from the database
        result = {
            'individuals': [],
            'meta': []
        }
        individuals = Individual.query.filter_by(signature=query['signature'], outcome=query['outcome'], model=query['model']).all()
        result['individuals'] = Individual.serialize_list(individuals)
        meta = Meta.query.filter_by(signature=query['signature'], outcome=query['outcome'], model=query['model'], subgroup='ALL', tissue_type='ALL').all()
        result['meta'] = Meta.serialize_list(meta)

        # parse and return the output data 
        return result, 200