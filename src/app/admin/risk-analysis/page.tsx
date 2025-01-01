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

interface RiskData {
  date: Date;
  value: number;
}

export default function RiskAnalysisPage() {
  const [riskData, setRiskData] = useState<RiskData[]>([]);

  useEffect(() => {
    const riskRef = ref(database, 'risk_analysis');
    onValue(riskRef, (snapshot) => {
      const value = snapshot.val();
      if (!value) return;

      const riskData = Object.entries(value).map(([timestamp, data]: [string, any]) => ({
        date: new Date(parseInt(timestamp) * 1000),
        value: data.risk,
      }));

      setRiskData(riskData);
    });
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Risk Analysis</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Risk Level Over Time</h3>
        </div>
        <div className="p-4">
          <ChartComponent 
            data={riskData}
            type="line"
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
