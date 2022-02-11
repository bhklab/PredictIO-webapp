"""
Module for the on the fly gene signature meta analysis feature
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

import time
"""
Task queue
"""
q = Queue(connection=conn)

"""
GeneSignatureReauest Route class.
"""


class BiomarkerEvaluationRequest(Resource):
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
                'analysis_id': str(uuid.uuid4()),
                'study': ",".join(query['study']),
                'sex': ",".join(query['sex']),
                'primary': ",".join(query['primary']),
                'drugType': ",".join(query['drugType']),
                'dataType': query['dataType'],
                'sequencingType': ",".join(query['sequencingType']),
                'gene': ",".join(query['gene'])
            }
            print(parameters)

            analysis = AnalysisRequest(**{
                'analysis_id': parameters['analysis_id'],
                'analysis_type': 'biomarker_eval',
                'email': query['email'],
                'error': False,
                'error_message': '',
                'time_submitted': datetime.now(),
                'time_completed': None,
                'input_genes': parameters['gene'],
                'input_datatype': parameters['dataType'],
                'input_sex': parameters['sex'],
                'input_primary': parameters['primary'],
                'input_drug_type': parameters['drugType'],
                'input_sequencing': parameters['sequencingType'],
                'input_study': parameters['study']
            })

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
