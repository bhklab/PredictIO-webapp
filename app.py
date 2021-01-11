import os
from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS

# used to get values from .env file
from decouple import config

# db object
from models.db import db

# modules used for routes in 'resources' directory
from resources.test import Test
from resources.plot_data import VolcanoPlot, ForestPlot
from resources.io_predict import IOPredict

app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')

# initialize flask_sqlalchemy
app.config['SQLALCHEMY_DATABASE_URI'] = config('CONN_STR')
db.init_app(app)

CORS(app)

api = Api(app)

# routes
api.add_resource(Test, '/api/test')
api.add_resource(ForestPlot, '/api/explore/forest_plot')
api.add_resource(VolcanoPlot, '/api/explore/volcano_plot')
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