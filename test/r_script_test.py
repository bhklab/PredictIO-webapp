import subprocess
import os
import rpy2.robjects as robjects
# from rpy2.robjects import pandas2ri

cwd = os.path.abspath(os.getcwd())
r_path = os.path.join(cwd, 'test', 'test.R')
# subprocess.check_call(['Rscript', r_path], shell=False)
r = robjects.r
r.source(r_path)
output_r = r.test('hello')
output = robjects.conversion.rpy2py(output_r)
print(output)