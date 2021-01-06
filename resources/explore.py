import json
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

        # call the pipeline with the requenst

        # return the output data when pipeline is complete
        return "Success", 200