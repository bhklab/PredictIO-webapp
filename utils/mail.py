"""
Global mail object used to send notification emails.
"""
from flask_mail import Mail, Message

mail = Mail()

def send_mail(output):
    """sends email"""
    header = "Your analysis is ready"
    content = "<div style='font-size:14px;'>Your requested analysis is ready and available at:<br /><a href={0}{1}>{0}{1}</a></div>".format('http://localhost:3000/analysis/request/', output['analysis_id'][0])
    footer = "<div style='font-size:12px;'>Thank you for using IO.db, powered by <a href=https://www.pmgenomics.ca/bhklab/>BHK Lab</a>.</div>"

    if(output["error"][0]):
        header = "Error occurred during analysis"
        content = "<div style='font-size:14px;'>Error occurred during your analysis.<br />Please contact <b>support@iodb.ca</b> by citing your analysis ID: {0}</div>".format(output['analysis_id'][0]) 

    body = "<div style='font-family:arial;'>{0}<br /><br />{1}</div>".format(content, footer)

    msg = Message("[IO.db] " + header, sender='no-reply@iodb.ca', recipients=['user@email.com'])
    msg.html = body

    print('sending email')
    mail.send(msg)
    print('mail sent')
