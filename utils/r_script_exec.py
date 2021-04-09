"""
Includes functions to execute R script in a separate thread
"""
import os
import subprocess
import json
from .mail import send_mail

def execute_script(parameters):
    """function used to call R script in subprocess"""
    cwd = os.path.abspath(os.getcwd())
    r_path = os.path.join(cwd, 'r-scripts', 'io_meta', 'Run_Compute_Result.R')
    r_wd = os.path.join(cwd, 'r-scripts', 'io_meta')

    # command to be executed
    cmd = [
        'Rscript', 
        r_path, 
        r_wd, 
        '1234567890', # analysis id 
        ",".join(parameters['study']), 
        ",".join(parameters['sex']), 
        ",".join(parameters['primary']), 
        ",".join(parameters['drugType']), 
        parameters['dataType'],
        ",".join(parameters['sequencingType']), 
        ",".join(parameters['gene'])
    ]

    print(cmd)

    # variable to store results
    out = None

    r_process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    while True:

        line = r_process.stdout.readline()

        if not line:
            break
        else:
            out = line.rstrip().decode("utf-8")
    
    print('execution complete')
    
    # converts output to json (dictionary)
    output = json.loads(out)

    # send notification email
    send_mail(output)
