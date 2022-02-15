import os
import pandas as pd
# import numpy as np
import traceback
from .db import db
from .models.analysis_request import AnalysisRequest
from .models.dataset_gene import DatasetGene
from .models.dataset_identifier import DatasetIdentifier
from .models.dataset import Dataset
from .models.gene import Gene
from .models.patient import Patient
from .models.predictio_result import PredictIOResult
from .models.signature_individual import Individual
from .models.signature_kegg_network import SignatureKeggNetwork
from .models.signature_meta import Meta
from .models.signature_network import SignatureNetwork
from .models.signature_user_requested import UserRequested

import datetime

# used to delete old on-the-fly gene signature data requested by users
def delete_old_requests():
    try:
        old_data = AnalysisRequest.query.filter(AnalysisRequest.time_submitted <= datetime.datetime.today() - datetime.timedelta(days=60)).all()
        for row in old_data:
            print('deleting: ' + row.analysis_id)
            PredictIOResult.query.filter(PredictIOResult.analysis_id == row.analysis_id).delete()
            UserRequested.query.filter(UserRequested.analysis_id == row.analysis_id).delete()
            SignatureNetwork.query.filter(SignatureNetwork.analysis_id == row.analysis_id).delete()
            SignatureKeggNetwork.query.filter(SignatureKeggNetwork.analysis_id == row.analysis_id).delete()
            AnalysisRequest.query.filter(AnalysisRequest.analysis_id == row.analysis_id).delete()
        
        db.session.commit() # commit all the changes
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
        db.session.rollback()  # Rollback the changes on error
    finally:
        print('Done')
        db.session.close()  # Close the connection
    
def backup_requested_data():
    try:
        def create_table_csv(Model):
            data = Model.query.all()
            data = Model.serialize_list(data)
            columns = [m.key for m in Model.__table__.columns]
            df = pd.DataFrame(data, columns=columns)
            dir_path = os.path.dirname(os.path.realpath(__file__))
            df.to_csv(os.path.join(dir_path, 'data/%s.csv' % Model.__tablename__), index=False)

        models = [
            AnalysisRequest,
            SignatureKeggNetwork,
            SignatureNetwork,
            UserRequested
        ]
        for model in models:
            create_table_csv(model)
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
        db.session.rollback()  # Rollback the changes on error
    finally:
        print('Done')
        db.session.close()  # Close the connection

def restore_requested_data():
    try:
        models = [
            AnalysisRequest,
            SignatureKeggNetwork,
            SignatureNetwork,
            UserRequested
        ]
        def insert_data(Model):
            dir_path = os.path.dirname(os.path.realpath(__file__))
            file_path = os.path.join(dir_path, 'data/%s.csv' % Model.__tablename__)
            df = pd.read_csv(file_path, quotechar='\"', skipinitialspace=True, keep_default_na=False)
            columns = [m.key for m in Model.__table__.columns]
            for index, row in df.iterrows():
                obj = {}
                for col in columns:
                    obj[col] = row[col] if col != 'analysis_type' else 'biomarker_eval'
                record = Model(**obj)
                db.session.add(record)
        for model in models:
            insert_data(model)
        db.session.commit()
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
        db.session.rollback()  # Rollback the changes on error
    finally:
        print('Done')
        db.session.close()  # Close the connection  

