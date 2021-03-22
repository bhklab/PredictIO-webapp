"""
Global mail object used to send notification emails.
"""
from flask_mail import Mail, Message

mail = Mail()

def send_mail(output):
    """sends email"""
    header = "Your analysis is ready"
    status = "success"
    content = "analysis successful"

    if(output["error"][0]):
        header = "Error occurred during analysis"
        status = "error"
        content = output["message"][0]

    body = "status: " + status + "\n\n" + "content: " + content

    msg = Message("[IO.db] " + header, sender='no-reply@iodb.ca', recipients=['user@email.com'])
    msg.body = body

    print('sending email')
    mail.send(msg)
    print('mail sent')
