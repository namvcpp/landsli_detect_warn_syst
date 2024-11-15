"use client";
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import RiskGraph from '../components/monitor/RiskGraph';

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

interface SensorData {
  latitude: number;
  longitude: number;
  timestamp: string;
  risk: number;
  sensorId: number;
}

export default function MonitoringDashboard() {
  const [mapMarkers, setMapMarkers] = useState<{ sensorId: number; latitude: number; longitude: number; }[]>([]);
  const [graphSensorData, setGraphSensorData] = useState<SensorData[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBbnHy_9HBHYDYssKdBjJyX2W96lYoB5m8"
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSensorData = async () => {
      const querySnapshot = await getDocs(collection(db, "sensor_data"));
      const sensorData: SensorData[] = [];
      const markers: { sensorId: number; latitude: number; longitude: number; }[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as SensorData;
        sensorData.push(data);
        markers.push({
          sensorId: data.sensorId,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      });

      setMapMarkers(markers);
      setGraphSensorData(sensorData);
    };

    fetchSensorData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 w-full h-full items-center sm:items-start relative">
        {isClient && isLoaded && (
          <div className="w-full relative">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '600px' }}
              center={{ lat: 16.03958105087673, lng: 108.23595687329225 }}
              zoom={10}
            >
              {mapMarkers.map((marker) => (
                <Marker
                  key={marker.sensorId}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  label={`Sensor ${marker.sensorId}`}
                />
              ))}
            </GoogleMap>
            <button 
              onClick={() => setShowGraph(!showGraph)}
              className="absolute bottom-10 left-4 bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              {showGraph ? 'Hide Risk Graph' : 'Show Risk Graph'}
            </button>
          </div>
        )}
        {showGraph && (
          <div className="w-full" id="popupBoxOnePosition">
            <div className="popupBoxWrapper w-full">
              <div className="popupBoxContent w-full">
                <RiskGraph data={graphSensorData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}