'''Routes used to get a list of available signatures'''
import math
from flask import request
from flask_restful import Resource
from sqlalchemy.orm import load_only
from models.signature_meta import Meta

class SignaturesList(Resource):
    def get(self):

        # fetch data from the database
        result = {
            'signatures': [],
            'outcome': [],
            'model': []
        }
        options = Meta.query.with_entities(Meta.signature, Meta.outcome, Meta.model).distinct().filter().all()

        for option in options:
            result['signatures'].append(option[0])
            result['outcome'].append(option[1])
            result['model'].append(option[2])
        
        result['signatures'] = list(set(result['signatures']))
        result['outcome'] = list(set(result['outcome']))
        result['model'] = list(set(result['model']))

        result['signatures'].sort()
        result['outcome'].sort()
        result['model'].sort()

        return result, 200
    
    def post(self):
        return  "Only get method is allowed", 400