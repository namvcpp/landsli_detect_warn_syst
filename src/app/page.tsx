"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import * as d3 from 'd3';

const firebaseConfig = {
  apiKey: "AIzaSyBeNKymDI7abdj6Hj6YVHWqPU4QoIA8Kac",
  authDomain: "landslide-7cf2a.firebaseapp.com",
  databaseURL: "https://landslide-7cf2a-default-rtdb.firebaseio.com",
  projectId: "landslide-7cf2a",
  storageBucket: "landslide-7cf2a.firebasestorage.app",
  messagingSenderId: "939694240101",
  appId: "1:939694240101:web:c2ba7a13b43f59a0f9718c",
  measurementId: "G-F5PSQDXDTC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  interface SensorData {
    latitude: number;
    longitude: number;
  }

  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'sensor_data'));
      const data = querySnapshot.docs.map(doc => doc.data() as SensorData);
      setSensorData(data);
    };
    fetchData();
  }, []);

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 w-full h-full items-center sm:items-start">
        <LoadScript googleMapsApiKey="AIzaSyBbnHy_9HBHYDYssKdBjJyX2W96lYoB5m8">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '600px' }}
            center={{ lat: 16.03958105087673, lng: 108.23595687329225 }}
            zoom={10}
          >
            {sensorData.map((sensor, index) => (
              <Marker
                key={index}
                position={{ lat: sensor.latitude, lng: sensor.longitude }}
                label={`Sensor ${index + 1}`}
              />
            ))}
          </GoogleMap>
        </LoadScript>
        <button onClick={toggleGraph}>Risk Graph View</button>
        {showGraph && (
          <div id="popupBoxOnePosition">
            <div className="popupBoxWrapper">
              <div className="popupBoxContent">
                <div className="graph"></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}