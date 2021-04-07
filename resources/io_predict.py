"""
Module for the IO Predict feature
"""
import sys
import threading
import uuid
from flask import request
from flask import copy_current_request_context
from flask_restful import Resource
from utils.r_script_exec import execute_script
from db.models.analysis_request import AnalysisRequest
from datetime import datetime

"""
IO Predict Route class.
"""
class IOPredict(Resource):
    def get(self):
        return "Only post method is allowed", 400
    
    def post(self):
        status = 200
        res = {
            "error": 0,
            "data": []
        }
        
        try:
            # parse request
            query = request.get_json()
            parameters = {
                'analysis_id': uuid.uuid4(),
                'study': ",".join(query['study']),
                'sex': ",".join(query['sex']),
                'primary': ",".join(query['primary']), 
                'drugType': ",".join(query['drugType']), 
                'dataType': query['dataType'],
                'sequencingType': ",".join(query['sequencingType']), 
                'gene': ",".join(query['gene'])
            }

            analysis = AnalysisRequest(
                analysis_id = parameters['analysis_id'],
                email = query['email'],
                time_submitted = datetime.now(),
                time_completed = None,
                input_genes = parameters['gene'],
                input_datatype = parameters['dataType'],
                input_sex = parameters['sex'],
                input_primary = parameters['primary'],
                input_drug_type = parameters['drugType'],
                input_sequencing = parameters['sequencingType'],
                input_study = parameters['study']
            )

            # TO DO: insert analysis request into database.

            """
            Function to be executed in a separate thread.
            Add @copy_current_request_context decorator so that Flask_Mail module can access the app's request context.
            """
            @copy_current_request_context
            def run_async(parameters):
                execute_script(parameters)

            thread = threading.Thread(target=run_async, args=(parameters,))
            thread.start()
            print('thread started')

        except:
            print('error')
            e = sys.exc_info()[0]
            print(e)

            res['error'] = 1
            res['errorMessage'] = e
            status = 500

        return res, status
