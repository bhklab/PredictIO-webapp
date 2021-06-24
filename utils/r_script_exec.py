"""
Includes functions to execute R script in a separate thread
"""
import os
import subprocess
import json
import traceback
from datetime import datetime
from .mail import send_mail
from db.db import db
from db.models.signature_user_requested import UserRequested
from db.models.signature_network import SignatureNetwork
from db.models.signature_kegg_network import SignatureKeggNetwork
from db.models.analysis_request import AnalysisRequest
from resources import create_app
# gets application context
app = create_app()
app.app_context().push()


def execute_script(parameters):
    """function used to call R script in subprocess"""
    cwd = os.path.abspath(os.getcwd())
    print(cwd)
    r_path = os.path.join(cwd, 'r-scripts', 'io_meta', 'Run_Compute_Result.R')
    r_wd = os.path.join(cwd, 'r-scripts', 'io_meta')
    print('Running analysis')
    print(parameters)
    # command to be executed
    cmd = [
        'Rscript',
        r_path,
        r_wd,
        parameters['analysis_id'],  # analysis id
        parameters['study'],
        parameters['sex'],
        parameters['primary'],
        parameters['drugType'],
        parameters['dataType'],
        parameters['sequencingType'],
        parameters['gene']
    ]

    # variable to store results
    out = None

    r_process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    while True:

        line = r_process.stdout.readline()
        if not line:
            break
        else:
            out = line.rstrip().decode("utf-8")

    print('execution complete')

    # converts output to json (dictionary)
    output = json.loads(out)
    email = ''
    try:
        # Add data to signature_user_requested table and update analysis request with finished date and time
        analysis_id = output['analysis_id'][0]
        analysis_request = AnalysisRequest.query.filter(
            AnalysisRequest.analysis_id == analysis_id).first()
        email = analysis_request.email
        if not output['error'][0]:
            # insert on-the-fly gene signature data
            for row in output['data']:
                meta_analysis = int(row['Meta_Analysis'])
                n = row['N']
                result_row = UserRequested(**{
                    'analysis_id': analysis_id,
                    'study': row['study'] if meta_analysis != 1 else None,
                    'primary_tissue': row['Primary'] if meta_analysis != 1 else None,
                    'outcome': row['Outcome'],
                    'model': row['Model'],
                    'sequencing': row['Sequencing'] if meta_analysis != 1 else None,
                    'meta_analysis': meta_analysis,
                    'subgroup': row['Subgroup'] if meta_analysis == 1 else None,
                    'tissue_type': row['Type'] if meta_analysis == 1 else None,
                    'n': n,
                    'effect_size': row['Effect_size'] if n >= 3 else None,
                    'se': row['SE'] if n >= 3 else None,
                    '_95ci_low': row['CI95_low'] if n >= 3 else None,
                    '_95ci_high': row['CI95_high'] if n >= 3 else None,
                    'pval': row['Pval'] if n >= 3 else None,
                    'i2': row['I2'] if meta_analysis == 1 and n >= 3 else None,
                    'pval_i2': row['Pval_I2'] if meta_analysis == 1 and n >= 3 else None,
                })
                db.session.add(result_row)

            if bool(output['network']) and bool(output['kegg']) :
                # insert network data
                for row in output['network']:
                    network_row = SignatureNetwork(**{
                        'analysis_id': analysis_id,
                        'signature': row['_row'],
                        'x': row['x'],
                        'y': row['y'],
                        'cluster': row['cluster']
                    })
                    db.session.add(network_row)

                # insert KEGG network data
                for row in output['kegg']:
                    network_row = SignatureKeggNetwork(**{
                        'analysis_id': analysis_id,
                        'cluster': row['cluster'],
                        'pathway': row['pathway']
                    })
                    db.session.add(network_row)
                print('network data added')
            else:
                print('no network data')

            analysis_request.time_completed = datetime.now()
        else:
            print('error occurred')
            print(output["message"][0])
            analysis_request.error = True
            analysis_request.error_message = output["message"][0]

        db.session.commit()
        print('data inserted/updated')
    except Exception as e:
        print('Exception ', e)
        print(traceback.format_exc())
        db.session.rollback()
    finally:
        db.session.close()
        # send notification email
        send_mail(email, output)
        return 'Done'
