"""
Module for the IO Predict feature
"""
import sys
import threading
from flask import request
from flask import copy_current_request_context
from flask_restful import Resource
from utils.r_script_exec import execute_script

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

            """
            Function to be executed in a separate thread.
            Add @copy_current_request_context decorator so that Flask_Mail module can access the app's request context.
            """
            @copy_current_request_context
            def run_async(query):
                execute_script(query)

            thread = threading.Thread(target=run_async, args=(query,))
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
