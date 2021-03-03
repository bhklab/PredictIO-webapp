import sys
import os
import subprocess
import threading
# import pandas as pd
import json
from flask import Flask, request, jsonify, make_response
from flask_restful import Resource, reqparse

# Test route used to handle async process

class AsyncProcess(Resource):
    def get(self):
        status = 200
        res = {
            "error": 0,
            "data": []
        }
        
        try:
            cwd = os.path.abspath(os.getcwd())
            r_path = os.path.join(cwd, 'r-scripts', 'test1.R')
            cmd = ['Rscript', r_path, 'hello', 'test', 'TRUE', 'TRUE']

            def run_in_thread():
                p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                (output, err) = p.communicate()

                self.callback(output, err)

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

    def post(self):
        print("Submitting the IO Predict request.")

        # parse request

        # call the pipeline with the requenst

        # return the output data when pipeline is complete
        return "success", 200
    
    @staticmethod
    def callback(output, err):
        error = err.decode("utf-8")
        if(len(error) > 0):
            print(error)
        else:
            print(output)
        print('thread ended')
    