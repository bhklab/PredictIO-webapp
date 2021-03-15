import os
import pandas as pd
import json
from flask import Flask, request, jsonify, make_response
from flask_restful import Resource, reqparse

# Route used to submit request for the "IO Predict" pipeline

class Test(Resource):
    def get(self):
        # read example output as a dataframe
        # file_path = os.getcwd() + '/example_output/example_explore.txt'
        # df = pd.read_csv(file_path, sep='\t')

        # # convert it to a json object
        # json_obj = df.to_json(orient='records')
        print('test')

        return "test", 200

    def post(self):
        print("Submitting the IO Predict request.")

        # parse request

        # call the pipeline with the requenst

        # return the output data when pipeline is complete
        return "Success", 200