"""
Module for the on the fly gene signature meta analysis feature
"""
from worker import conn
from rq.job import Job
from rq import Queue
from redis import Redis
import threading
import uuid
import traceback
from flask import request
from flask import copy_current_request_context
from utils.r_script_exec import execute_script
from flask_restful import Resource
from db.db import db
from db.models.analysis_request import AnalysisRequest
from datetime import datetime

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
            print(datetime.now())

            analysis = AnalysisRequest(**{
                'analysis_id': parameters['analysis_id'],
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

            """
            Function to be executed in a separate thread.
            Add @copy_current_request_context decorator so that Flask_Mail module can access the app's request context.
            """
            # @copy_current_request_context
            # result = q.enqueue_call(
            #     func=execute_script, args=(parameters,)
            # )

            # q.enqueue(run_async, parameters)
            q.enqueue(execute_script, parameters)
            print('Request enqueued')

            # thread = threading.Thread(target=run_async, args=(parameters,))
            # thread.start()
            # print('thread started')
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
