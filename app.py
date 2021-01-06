import os
from flask import Flask, request, send_from_directory, jsonify
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')

# used to get values from .env file
from decouple import config

# initialize flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = config('CONN_STR')
db = SQLAlchemy(app)

# modules used for routes in 'resources' directory
from resources.test import Test
from resources.explore import Explore
from resources.io_predict import IOPredict

CORS(app)

api = Api(app)

# routes
api.add_resource(Test, '/api/test')
api.add_resource(Explore, '/api/explore')
api.add_resource(IOPredict, '/api/iopredict')

# Setup that enables react routing when serving static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath("./client/build")  # path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html')