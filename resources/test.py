import json
import simplejson
from flask import Flask, request, jsonify, make_response
from flask_restful import Resource, reqparse

# Route used to submit request for the "IO Predict" pipeline

class Test(Resource):
    def get(self):
        json_obj = jsonify({"message": "Test method"})
        return make_response(json_obj, 200)

    def post(self):
        print("Submitting the IO Predict request.")

        # parse request

        # call the pipeline with the requenst

        # return the output data when pipeline is complete
        return "Success", 200