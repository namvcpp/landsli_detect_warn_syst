"use client";
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import RiskGraph from '../components/monitor/RiskGraph';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
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
    const generateTestData = () => {
      const timeSeriesData = [];
      const now = new Date();
      const totalSensors = 4;
      const graphSensors = [1, 2, 3, 4];

      // Generate fixed locations for all sensors
      const sensorLocations = new Map();
      const markers = [];

      // First create unique markers for the map
      for (let sensorId = 1; sensorId <= totalSensors; sensorId++) {
        const location = {
          sensorId,
          latitude: 16.03958105087673 + (Math.random() - 0.5) * 0.1,
          longitude: 108.23595687329225 + (Math.random() - 0.5) * 0.1
        };
        markers.push(location);
        sensorLocations.set(sensorId, location);
      }

      // Then generate time series data using fixed locations
      for (let sensorId = 1; sensorId <= totalSensors; sensorId++) {
        const location = sensorLocations.get(sensorId);
        for (let i = 0; i < 24; i++) {
          timeSeriesData.push({
            timestamp: new Date(now.getTime() - (23 - i) * 3600000).toISOString(),
            latitude: location.latitude,
            longitude: location.longitude,
            risk: 50 + Math.sin(i / 3 + sensorId) * 20 + Math.random() * 20,
            sensorId: sensorId
          });
        }
      }

      // Filter data for graph - only keep specified sensors
      const graphData = timeSeriesData.filter(d => graphSensors.includes(d.sensorId));
      setMapMarkers(markers);
      setGraphSensorData(graphData);
    };

    generateTestData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 w-full h-full items-center sm:items-start relative">
        {isClient && isLoaded && (
          <div className="w-full relative">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '600px' }}
              center={{ lat: 16.03958105087673, lng: 108.23595687329225 }}
              zoom={11}
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