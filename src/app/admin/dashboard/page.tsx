'use client';
import { useState, useEffect } from 'react';
import ChartComponent from '@/app/components/admin/ChartComponent';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

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
const database = getDatabase(app);

interface SensorData {
  latitude: number;
  longitude: number;
  rain: number;
  soilMoisture: number;
  temperature: number;
  risk: number;
  timestamp: string;
  sensorId: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSensors: '0',
    highRiskSensors: '0',
    avgRisk: '0%',
    dataPoints: '0'
  });

  const [chartData, setChartData] = useState<SensorData[]>([]);

  useEffect(() => {
    const dataRef = ref(database, `sensor_data/2024-12-08`);

    onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      if (!value) return;

      const fetchedData: SensorData[] = [];
      const uniqueSensors = new Set<number>();
      let totalRisk = 0;
      let highRiskCount = 0;

      // Iterate through timestamps
      Object.keys(value).forEach(timestampKey => {
        const sensorData = value[timestampKey];

        // Iterate through sensors
        Object.keys(sensorData).forEach(sensorKey => {
          const sensor = sensorData[sensorKey];
          
          // Create a proper timestamp string
          const formattedTimestamp = new Date(parseInt(timestampKey) * 1000).toISOString();
          
          const dataPoint = {
            sensorId: Number(sensorKey.split(' ')[1]), // Extract number from "sensor X"
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            rain: sensor.rain,
            soilMoisture: sensor.soilMoisture,
            temperature: sensor.temperature,
            risk: sensor.risk,
            timestamp: formattedTimestamp // Use the timestamp from the data structure
          };

          fetchedData.push(dataPoint);
          uniqueSensors.add(dataPoint.sensorId);
          totalRisk += sensor.risk;
          if (sensor.risk > 70) highRiskCount++;
        });
      });

      const avgRisk = (totalRisk / fetchedData.length).toFixed(2);

      setStats({
        totalSensors: new Intl.NumberFormat().format(uniqueSensors.size),
        highRiskSensors: new Intl.NumberFormat().format(highRiskCount),
        avgRisk: `${avgRisk}%`,
        dataPoints: new Intl.NumberFormat().format(fetchedData.length)
      });

      setChartData(fetchedData);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Total Sensors</h2>
          <p className="text-3xl font-bold">{stats.totalSensors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">High Risk Sensors</h2>
          <p className="text-3xl font-bold">{stats.highRiskSensors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Average Risk</h2>
          <p className="text-3xl font-bold">{stats.avgRisk}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Data Points</h2>
          <p className="text-3xl font-bold">{stats.dataPoints}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Risk Level Distribution</h2>
          <div className="h-[300px]">
            <ChartComponent 
              data={chartData.map(d => ({ date: new Date(d.timestamp), value: d.risk }))}
              type="pie"
              height={300}
              colorScale={d => d.value > 50 ? 'red' : 'green'}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Monthly Risk Trends</h2>
          <div className="h-[300px]">
            <ChartComponent 
              data={chartData.map(d => ({ date: new Date(d.timestamp), value: d.risk }))}
              type="bar"
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}