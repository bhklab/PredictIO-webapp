'''Routes used to get study Descriptions.'''
from flask import request
from flask_restful import Resource
from db.models.dataset import Dataset

class DescriptionModal(Resource):
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
            - returns filtered Dataset objects based on query
            - to be used to get data for a study description modal.
            Parameters:
            Returns:
                result: a list of dataset attributes
        '''
        # parse request
        query = request.get_json()

        # fetch data from the database
        result = []

        description = Dataset.query.filter_by(
            dataset_name=query['dataset_name']).first()

        result = description.serialize()

        # parse and return the output data
        return result, 200