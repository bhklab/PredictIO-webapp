import json
from flask import Flask, request
from flask_restful import Resource, reqparse
from models.signature_individual import Individual
from models.signature_meta import Meta

# Route used to submit request for the "Explore" pipeline

class Explore(Resource):
    def get(self):

        # individuals = Individual.query.limit(10).all()
        # serialized = Individual.serialize_list(individuals)
        meta = Meta.query.limit(10).all()
        serialized = Meta.serialize_list(meta)
        return serialized, 200
    
    def post(self):
        print("Submitting the explore request.")

        # parse request

        # call the pipeline with the requenst

        # return the output data when pipeline is complete
        return "Success", 200