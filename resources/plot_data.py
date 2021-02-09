'''Routes used to get plot data'''
import math
from flask import request
from flask_restful import Resource
from models.signature_individual import Individual
from models.signature_meta import Meta

class VolcanoPlot(Resource):
    '''
    Route used to get data for volcano plot
    '''
    def get(self):
        '''
        get request - not used for this resource
            Parameters:
            Returns:
                    error message with 400
        '''
        return "Only post method is allowed", 400

    def post(self):
        '''
        posts request
            - returns filtered signature_meta model objects based on query
            - tobe used to get data for a volcano plot
            Parameters:
            Returns:
                    result: a list of signature_meta model
        '''
        # parse request
        query = request.get_json()

        print(query['signatures'])

        # fetch data from the database
        result = []
        meta = Meta.query.filter(
            Meta.outcome == query['outcome'],
            Meta.model == query['model'],
            Meta.subgroup == 'ALL',
            Meta.n > 3
        )

        if len(query['signatures']) > 0 and 'ALL' not in query['signatures']:
            meta = meta.filter(Meta.signature.in_(query['signatures']))
        
        result = Meta.serialize_list(meta.all())
        for item in result:
            item['logPval'] = -math.log10(item['pval'])

        # parse and return the output data
        return result, 200

class ForestPlot(Resource):
    '''
    Route used to get data for forest plot
    '''
    def get(self):
        '''
        get request - not used for this resource
            Parameters:
            Returns:
                    error message with 400
        '''
        return "Only post method is allowed", 400

    def post(self):
        '''
        posts request
            - returns filtered signature_meta and signature_individual model objects based on query
            - to be used to get data for a forest plot.
            Parameters:
            Returns:
                result: a list of signature_individual models an corrsponding signature_meta model
        '''
        # parse request
        query = request.get_json()

        # fetch data from the database
        result = {
            'individuals': [],
            'meta': []
        }
        individuals = Individual.query.filter_by(
            signature=query['signature'],
            outcome=query['outcome'],
            model=query['model']).all()
        result['individuals'] = Individual.serialize_list(individuals)
        meta = Meta.query.filter_by(
            signature=query['signature'],
            outcome=query['outcome'],
            model=query['model']).all()
        result['meta'] = Meta.serialize_list(meta)

        # parse and return the output data
        return result, 200
