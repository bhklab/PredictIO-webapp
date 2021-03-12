import sys
import os
import subprocess
import threading
# import pandas as pd
import json
from flask import Flask, request, jsonify, make_response
from flask_restful import Resource, reqparse

# Route used to submit request for the "IO Predict" pipeline

class IOPredict(Resource):
    def get(self):
        return "Only post method is allowed", 400
    
    def post(self):
        status = 200
        res = {
            "error": 0,
            "data": []
        }

        # parse request
        query = request.get_json()
        
        try:
            cwd = os.path.abspath(os.getcwd())

            r_path = os.path.join(cwd, 'r-scripts', 'io_meta', 'Run_Compute_Result.R')
            r_wd = os.path.join(cwd, 'r-scripts', 'io_meta')

            cmd = [
                'Rscript', 
                r_path, 
                r_wd, 
                '1234567890', # analysis id 
                ",".join(query['study']), 
                ",".join(query['sex']), 
                ",".join(query['primary']), 
                ",".join(query['drugType']), 
                ",".join(query['dataType']), 
                ",".join(query['sequencingType']), 
                ",".join(query['gene'])
            ]

            def run_in_thread():
                out = None

                p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                while True:

                    line = p.stdout.readline()

                    if not line:
                        break
                    else:
                        out = line.rstrip().decode("utf-8")

                print(out)

            thread = threading.Thread(target=run_in_thread)
            thread.start()

            print('thread started')

        except:
            e = sys.exc_info()[0]
            print(e)

            res['error'] = 1
            res['errorMessage'] = e
            status = 500

        return res, status