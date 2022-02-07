import os
import pandas as pd
# import numpy as np
import traceback
from .db import db
from .models.signature_user_requested import UserRequested
from .models.signature_network import SignatureNetwork
from .models.signature_kegg_network import SignatureKeggNetwork
from .models.analysis_request import AnalysisRequest
import datetime

# used to delete old on-the-fly gene signature data requested by users
def delete_old_requests():
    try:
        old_data = AnalysisRequest.query.filter(AnalysisRequest.time_submitted <= datetime.datetime.today() - datetime.timedelta(days=60)).all()
        for row in old_data:
            print('deleting: ' + row.analysis_id)
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
    
    

