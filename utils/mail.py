"""
Global mail object used to send notification emails.
"""
from flask_mail import Mail, Message
from flask import current_app

mail = Mail()

def send_mail(email, output):
    """sends email"""

    header = "Your analysis is ready"

    content = '''<div style='font-size:14px;'>Your requested analysis is ready and available at:<br /><a href={0}{1}{2}>{0}{1}{2}</a></div>\
        <div style='font-size:14px; font-weight:bold;'>Please note that the analyses that are more than 30 days old may be deleted at any time.</div>'''\
    .format(current_app.config['APP_DOMAIN'], '/explore/biomarker/result/', output['analysis_id'][0])

    footer = '''<div style='font-size:12px;'>\
        Thank you for using PredictIO, powered by <a href=https://www.pmgenomics.ca/bhklab/>BHK Lab</a>.\
        </div>'''

    if(output["error"][0]):
        header = "Error occurred during analysis"

        content = '''<div style='font-size:14px;'>\
            Error occurred during your analysis.<br />\
            Please contact <b>support@PredictIO.ca</b> by citing your analysis ID: {0}\
            </div>'''.format(output['analysis_id'][0]) 

    body = "<div style='font-family:arial;'>{0}<br /><br />{1}</div>".format(content, footer)

    msg = Message("[PredictIO] " + header, sender='PredictIO@PredictIO.ca', recipients=[email])
    msg.html = body

    print('sending email')
    mail.send(msg)
    print('mail sent')
