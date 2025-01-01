'use client';
import { useState, useEffect } from 'react';
import ChartComponent from '@/app/components/admin/ChartComponent';
import { initializeApp } from 'firebase/app';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import AlertsTable from '@/app/components/admin/AlertsTable';
import { saveAs } from 'file-saver';

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

  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [chartData, setChartData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState('custom');

  const handleDownloadReport = () => {
    const reportData = {
      stats,
      alerts: alerts.slice(0, 100), // Last 100 alerts
      chartData: chartData.slice(0, 100), // Last 100 data points
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, `landslide-report-${new Date().toISOString()}.json`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let startTime: number;
        let endTime: number;

        if (dateRange === 'custom') {
          // Set time to start of day for start date
          const startDateTime = new Date(startDate);
          startDateTime.setHours(0, 0, 0, 0);
          startTime = Math.floor(startDateTime.getTime() / 1000);

          // Set time to end of day for end date
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          endTime = Math.floor(endDateTime.getTime() / 1000);
        } else {
          const now = Math.floor(Date.now() / 1000);
          endTime = now;
          
          switch (dateRange) {
            case '24h':
              startTime = now - 24 * 60 * 60;
              break;
            case '7d':
              startTime = now - 7 * 24 * 60 * 60;
              break;
            case '30d':
              startTime = now - 30 * 24 * 60 * 60;
              break;
            default:
              startTime = now - 24 * 60 * 60;
          }
        }

        // Get all dates in range
        const dates = [];
        const currentDate = new Date(startTime * 1000);
        const loopEndDate = new Date(endTime * 1000);
        
        while (currentDate <= loopEndDate) {
          dates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Fetch data for each date
        const fetchedData: SensorData[] = [];
        const uniqueSensors = new Set<number>();
        let totalRisk = 0;
        let highRiskCount = 0;

        for (const date of dates) {
          const dataRef = ref(database, `sensor_data/${date}`);
          const snapshot = await new Promise<any>(resolve => {
            onValue(dataRef, (snapshot) => {
              resolve(snapshot.val());
            }, { onlyOnce: true });
          });

          if (snapshot) {
            Object.entries(snapshot).forEach(([timeKey, timeData]: [string, any]) => {
              const timestamp = parseInt(timeKey);
              if (timestamp >= startTime && timestamp <= endTime) {
                Object.entries(timeData).forEach(([sensorKey, sensorData]: [string, any]) => {
                  const dataPoint = {
                    sensorId: Number(sensorKey.split(' ')[1]),
                    ...sensorData,
                    timestamp: new Date(timestamp * 1000).toISOString()
                  };

                  fetchedData.push(dataPoint);
                  uniqueSensors.add(dataPoint.sensorId);
                  totalRisk += sensorData.risk;
                  if (sensorData.risk > 70) highRiskCount++;
                });
              }
            });
          }
        }

        // Update states with fetched data
        const avgRisk = fetchedData.length > 0 
          ? (totalRisk / fetchedData.length).toFixed(2)
          : '0';

        setStats({
          totalSensors: uniqueSensors.size.toString(),
          highRiskSensors: highRiskCount.toString(),
          avgRisk: `${avgRisk}%`,
          dataPoints: fetchedData.length.toString()
        });

        setChartData(fetchedData.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dateRange, startDate, endDate]);

  useEffect(() => {
    const alertsRef = ref(database, 'alerts');
    
    onValue(alertsRef, (snapshot) => {
      const value = snapshot.val();
      if (!value) return;

      const alertsData = Object.entries(value).map(([id, data]: [string, any]) => ({
        id,
        ...data,
        timestamp: new Date(data.timestamp).toISOString(),
      }));

      setAlerts(alertsData);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-4 items-center">
          <select
            className="px-3 py-2 border rounded-lg"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => date && setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className="px-3 py-2 border rounded-lg"
                dateFormat="yyyy-MM-dd"
              />
              <span>to</span>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => date && setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="px-3 py-2 border rounded-lg"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          )}
          
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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
          <h2 className="text-xl font-semibold mb-4">Daily Risk Trends</h2>
          <div className="h-[300px]">
            <ChartComponent 
              data={chartData.map(d => ({ date: new Date(d.timestamp), value: d.risk }))}
              type="bar"
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AlertsTable alerts={alerts} />
      </div>
    </div>
  );
}