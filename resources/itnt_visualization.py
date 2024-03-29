'''rountes used to get iTNT data visualization data by running R code'''
import sys
import os
import subprocess
from flask import request
from flask_restful import Resource
import json

class ITNTVisualization(Resource):
    def get(self):
        status = 200
        res = {
            "error": 0,
            "data": []
        }
        
        try:
            cwd = os.path.abspath(os.getcwd())
            #r_path = os.path.join(cwd, 'r-scripts', 'test1.R')
            r_path = os.path.join(cwd, 'r-scripts', 'itnt', 'iTNT-all.R')
            p = subprocess.Popen(['Rscript', r_path, 'hello', 'test', 'TRUE', 'FALSE'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            # (output, err) = p.communicate()
            
            while True:
                line = p.stdout.readline()
                # err = p.stderr.readline()

                # if(err):
                #     print('error')
                #     print(err.decode("utf-8"))
                #     break

                if not line:
                    break

                print(line.rstrip().decode("utf-8"))

            # error = err.decode("utf-8")
            # if(len(error) > 0):
            #     print(error)

            #     # res['error'] = 1
            #     # res['errorMessage'] = error
            # else:
            #     print(output.decode("utf-8"))
            #     # res['data'] = json.loads(output)

        except:
            e = sys.exc_info()[0]
            print(e)

            res['error'] = 1
            res['errorMessage'] = e
            status = 500

        return res, status

    def post(self):

        return "test", 200