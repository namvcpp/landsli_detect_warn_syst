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
        'soilMoisture': float(data[0]),
        'rain': float(data[1]),
        'accelX': int(data[2]),
        'accelY': int(data[3]),
        'accelZ': int(data[4]),
        'temperature': float(data[5]),
        'gyroX': int(data[6]),
        'gyroY': int(data[7]),
        'gyroZ': int(data[8]),
        'timestamp': firestore.SERVER_TIMESTAMP
    }
    send_to_firebase(sensor_data)