import serial
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("path/to/your/firebase/credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Serial Communication
ser = serial.Serial('/dev/ttyUSB0', 9600)

def send_to_firebase(data):
    doc_ref = db.collection('sensor_data').document()
    doc_ref.set(data)

while True:
    line = ser.readline().decode('utf-8').strip()
    data = line.split(',')
    sensor_data = {
        'accelX': float(data[0]),
        'accelY': float(data[1]),
        'accelZ': float(data[2]),
        'gyroX': float(data[3]),
        'gyroY': float(data[4]),
        'gyroZ': float(data[5]),
        'temperature': float(data[6]),
        'timestamp': firestore.SERVER_TIMESTAMP
    }
    send_to_firebase(sensor_data)