import json
from flask import Flask, request
from flask_restful import Resource, reqparse

# Route used to submit request for the "IO Predict" pipeline

class IOPredict(Resource):
    def get(self):
        return "Only post method is allowed", 400
    
    def post(self):
        print("Submitting the IO Predict request.")

        # parse request

        # call the pipeline with the requenst

        # return the output data when pipeline is complete
        return "Success", 200