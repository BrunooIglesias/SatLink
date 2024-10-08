# pip install mysql-connector-python

import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import base64
from io import BytesIO

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

mysql_host = os.getenv('MYSQL_HOST', 'localhost')
mysql_port = int(os.getenv('MYSQL_PORT', 3306))  

# Database configuration
db_config = {
    'host': mysql_host,
    'port': mysql_port,
    'user': 'myuser',
    'password': 'mypassword',
    'database': 'mydatabase'
}

# Email configuration
smtp_server = 'smtp.mailersend.net'
smtp_port = 587
email_user = 'MS_emJINr@trial-pq3enl6mdqrg2vwr.mlsender.net'  # Your SMTP user
email_password = '0Q2dvEmzlzfdIYeH'  # Your SMTP password

def fetch_pending_requests():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = "SELECT id, email, name, image, metadata FROM ResultsRequests WHERE sent = 0;"
        cursor.execute(query)
        results = cursor.fetchall()

        return results

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

def send_email(to_email, name, image, id_name, csv_data):
    subject = "Your Request Status"

    # Create the HTML body
    body = f"""
    <html>
        <body>
            <h1>Hello, {name}</h1>
            <p>Here is the status of your request:</p>
            <a href="localhost/image/{id_name}">Show results in web</a>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # Attach the HTML body
    msg.attach(MIMEText(body, 'html'))

    # Attach the image
    image_mime = MIMEImage(image)
    image_mime.add_header('Content-Disposition', f'attachment; filename="image.jpg"')  # Set the filename
    msg.attach(image_mime)

    # Decode CSV data if it's bytes, otherwise assume it's already a string
    if isinstance(csv_data, bytes):
        csv_data = csv_data.decode('utf-8')

    # Attach the CSV file (from the metadata)
    csv_mime = MIMEText(csv_data, 'csv')
    csv_mime.add_header('Content-Disposition', 'attachment', filename="results.csv")
    msg.attach(csv_mime)

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
            server.login(email_user, email_password)
            server.send_message(msg)
            print(f"Email sent to {to_email}")

    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")



def mark_as_sent(request_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "UPDATE ResultsRequests SET sent = 1 WHERE id = %s;"
        cursor.execute(query, (request_id,))
        conn.commit()

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

def main():
    pending_requests = fetch_pending_requests()

    for request in pending_requests:
        send_email(request['email'], request['name'], request['image'], request['id'], request['metadata'])
        mark_as_sent(request['id'])

if __name__ == "__main__":
    main()
