"""
Main configuration an setup for the web app.
"""
import os
from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS

# used to get values from .env file
from decouple import config

# db object
from db.db import db
from db.seed_database import seed
from db.seed_database import create_table

# mail object
from utils.mail import mail

# modules used for routes in 'resources' directory
from resources.test import Test
from resources.plot_data import VolcanoPlot, ForestPlot
from resources.dropdown_explore import ExploreDropdownOption
from resources.dropdown_clinical_data import ClinicalDataDropdown
from resources.search_gene import SearchGene
from resources.gene_signature_request import GeneSignatureRequest
from resources.gene_signature_result import GeneSignatureResult, GeneSignatureVolcanoPlot, GeneSignatureForestPlot
from resources.itnt_visualization import ITNTVisualization

app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')

# initialize flask_sqlalchemy
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = config('CONN_STR')
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
db.init_app(app)

CORS(app)

# initialize mail object 
app.config['MAIL_SERVER'] = config('MAIL_SERVER_TEST')
app.config['MAIL_PORT'] = config('MAIL_PORT_TEST')
app.config['MAIL_USERNAME'] = config('MAIL_USERNAME_TEST')
app.config['MAIL_PASSWORD'] = config('MAIL_PASSWORD_TEST')
mail.init_app(app)
app.extensions['mail'].debug = 0

api = Api(app)

# routes
api.add_resource(Test, '/api/test')

api.add_resource(ExploreDropdownOption, '/api/dropdown_option/explore')
api.add_resource(ClinicalDataDropdown, '/api/dropdown_option/clinical_data/<dropdown_type>')
api.add_resource(SearchGene, '/api/search_gene')

api.add_resource(ForestPlot, '/api/explore/forest_plot')
api.add_resource(VolcanoPlot, '/api/explore/volcano_plot')
api.add_resource(GeneSignatureRequest, '/api/explore/signature/request')
api.add_resource(GeneSignatureResult, '/api/explore/signature/result/<analysis_id>')
api.add_resource(GeneSignatureVolcanoPlot, '/api/explore/signature/volcano_plot/<analysis_id>')
api.add_resource(GeneSignatureForestPlot, '/api/explore/signature/forest_plot/<analysis_id>')

api.add_resource(ITNTVisualization, '/api/explore/itnt_data')


# Setup that enables react routing when serving static files


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath("./client/build")  # path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html')

'''
flask cli command to seed database
'''
@app.cli.command("seed-database")
def seed_database():
    seed()

@app.cli.command("create-table")
def create_single_table():
    create_table()