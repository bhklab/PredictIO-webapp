import os
from flask import request
from flask_restful import Resource
import traceback

class UploadFile(Resource):
    def get(self):
        return "Only post method is allowed", 400
    
    def post(self):
        status = 200
        res = {
            "error": 0,
            "data": []
        } 
        try:
            cwd = os.path.abspath(os.getcwd())
            target=os.path.join(cwd, 'r-scripts', 'data', 'tmp')
            file = request.files['file']
            file.save("/".join([target, request.form['filename'] + '.txt']))
            print('file saved')
        except Exception as e:
            print('Exception ', e)
            print(traceback.format_exc())
            res['error'] = 1
            res['errorMessage'] = e
            status = 500
        finally:
            return res, status