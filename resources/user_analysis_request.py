"""
Module for the on the fly analysis feature
"""
# import threading
from worker import conn
from rq import Queue
import uuid
import traceback
from flask import request
# from flask import copy_current_request_context
from flask_restful import Resource
from db.db import db
from db.models.analysis_request import AnalysisRequest
from datetime import datetime

# dev code
# from utils import r_script_exec
"""
Task queue
"""
q = Queue(connection=conn)

"""
UserAnalysisRequest Route class.
"""
class UserAnalysisRequest(Resource):
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
            analysis = None
            parameters = {
                'analysis_id': str(uuid.uuid4()) if query['analysis_type'] == 'biomarker_eval' else query['analysis_id'],
                'analysis_type': query['analysis_type']
            }
            if(query['analysis_type'] == 'biomarker_eval'):
                parameters['study'] = ",".join(query['study'])
                parameters['sex'] = ",".join(query['sex'])
                parameters['primary'] = ",".join(query['primary'])
                parameters['drugType'] = ",".join(query['drugType'])
                parameters['dataType'] = query['dataType']
                parameters['sequencingType'] = ",".join(query['sequencingType'])
                parameters['gene'] = ",".join(query['gene'])
            
            analysis = AnalysisRequest(**{
                'analysis_id': parameters['analysis_id'],
                'analysis_type': parameters['analysis_type'],
                'email': query['email'],
                'error': False,
                'error_message': '',
                'time_submitted': datetime.now(),
                'time_completed': None
            })    
            if(query['analysis_type'] == 'biomarker_eval'):
                analysis.input_genes = parameters['gene']
                analysis.input_datatype = parameters['dataType']
                analysis.input_sex = parameters['sex']
                analysis.input_primary = parameters['primary']
                analysis.input_drug_type = parameters['drugType']
                analysis.input_sequencing = parameters['sequencingType']
                analysis.input_study = parameters['study']           
            
            # Insert analysis request into database.
            db.session.add(analysis)
            db.session.commit()
            # adds a new job to redis queue to be executed with current parameters
            q.enqueue('utils.r_script_exec.execute_script',
                      job_timeout=3600, args=(parameters,))
            
            # development code. executes the analysis script without enqueing to redis server
            # r_script_exec.execute_script(parameters)

            print('Request enqueued')
        except Exception as e:
            print('Exception ', e)
            print(traceback.format_exc())
            db.session.rollback()
            res['error'] = 1
            res['errorMessage'] = e
            status = 500
        finally:
            db.session.close()
            return res, status