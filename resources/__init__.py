# Moved app initialization here so it can accessed by redis worker
"""
Main configuration an setup for the web app.
"""
import os
from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS
from urllib.parse import quote 

# used to get values from .env file
from decouple import config

# db object
from db.db import db
from db.seed_database import seed
from db.seed_database import create_table
from db.seed_database import delete_table_rows
from db.maintenance import delete_old_requests, backup_requested_data, restore_requested_data

# mail object
from utils.mail import mail

# modules used for routes in 'resources' directory
from resources.test import Test
from resources.plot_data import VolcanoPlot, ForestPlot
from resources.modal_data import DescriptionModal
# from resources.dropdown_option import DropdownOption
from resources.dropdown_explore import ExploreDropdownOption
from resources.biomarker_evaluation_query import BiomarkerEvaluationQuery
from resources.search_gene import SearchGene
from resources.user_analysis_request import UserAnalysisRequest
from resources.biomarker_evaluation_result import BiomarkerEvaluationResult, BiomarkerEvaluationVolcanoPlot, BiomarkerEvaluationForestPlot
from resources.predictio_file import UploadFile, DownloadExampleFile
from resources.predictio_result import PredictIO
from resources.datasets import Datasets
from resources.itnt_visualization import ITNTVisualization


def create_app():
    app = Flask(__name__,
                static_url_path='',
                static_folder='client/build')

    # initialize flask_sqlalchemy
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://" + config('DB_USER') + ":" + quote(config('DB_PWD')) + "@" + config('DB_HOST') + "/" + config('DB_NAME')
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    db.init_app(app)

    CORS(app)

    # initialize mail object
    # comment this code out for Azure deployment
    app.config['MAIL_SERVER'] = config('MAIL_SERVER')
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = config('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = config('SG_KEY')
    app.config['MAIL_DEFAULT_SENDER'] = config('MAIL_DEFAULT_SENDER')
    # app.config['MAIL_SERVER'] = config('MAIL_SERVER_TEST')
    # app.config['MAIL_PORT'] = config('MAIL_PORT_TEST')
    # app.config['MAIL_USERNAME'] = config('MAIL_USERNAME_TEST')
    # app.config['MAIL_PASSWORD'] = config('MAIL_PASSWORD_TEST')
    mail.init_app(app)
    app.extensions['mail'].debug = 0

    api = Api(app)

    # register app domain name to the config object so that it can be accessed by the mailer.
    app.config['APP_DOMAIN'] = config('APP_DOMAIN')

    # routes
    api.add_resource(Test, '/api/test')

    api.add_resource(ExploreDropdownOption, '/api/dropdown_option/explore')
    api.add_resource(SearchGene, '/api/search_gene/<datatype>')

    api.add_resource(ForestPlot, '/api/explore/forest_plot')
    api.add_resource(VolcanoPlot, '/api/explore/volcano_plot')
    api.add_resource(UserAnalysisRequest, '/api/analysis/request')
    api.add_resource(UploadFile, '/api/predictio/upload_file')
    api.add_resource(DownloadExampleFile, '/api/predictio/download_example')
    api.add_resource(BiomarkerEvaluationQuery,
                     '/api/explore/biomarker/query/<dropdown_type>')
    api.add_resource(BiomarkerEvaluationResult,
                     '/api/explore/biomarker/result/<analysis_id>')
    api.add_resource(BiomarkerEvaluationVolcanoPlot,
                     '/api/explore/biomarker/result/volcano_plot/<analysis_id>')
    api.add_resource(BiomarkerEvaluationForestPlot,
                     '/api/explore/biomarker/result/forest_plot/<analysis_id>')
    api.add_resource(PredictIO, '/api/predictio/result/<analysis_id>')
    api.add_resource(DescriptionModal, '/api/explore/description_modal')
    api.add_resource(Datasets, '/api/datasets')

    # unused 
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
    
    @app.cli.command("delete-table-rows")
    def delete_table():
        delete_table_rows()
    
    @app.cli.command("delete-old-requests")
    def delete_data():
        delete_old_requests()
    
    @app.cli.command("backup-requested-data")
    def backup_data():
        backup_requested_data()
    
    @app.cli.command("restore-requested-data")
    def restore_data():
        restore_requested_data()

    return app
