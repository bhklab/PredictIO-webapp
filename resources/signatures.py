import os
from flask import request, json
from flask_restful import Resource

class Signatures(Resource): 
    def get(self):
        path = os.path.join(os.path.dirname(__file__), '../utils/data/signatures.json')
        result = json.load(open(path))
        return result, 200

    def post(self):
        return "only get request is allowed", 400