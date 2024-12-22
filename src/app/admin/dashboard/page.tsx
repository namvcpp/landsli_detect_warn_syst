'use client';
import { useState, useEffect } from 'react';
import StatsCard from '@/app/components/admin/StatsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSensors: '24',
    activeAlerts: '3',
    avgRisk: '45%',
    dataPoints: '1,234'
  });

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
        <StatsCard 
          title="Total Sensors"
          value={stats.totalSensors}
          trend="up"
          icon="📡"
        />
        <StatsCard 
          title="Active Alerts"
          value={stats.activeAlerts}
          trend="down"
          icon="⚠️"
        />
        <StatsCard 
          title="Average Risk"
          value={stats.avgRisk}
          trend="up"
          icon="📊"
        />
        <StatsCard 
          title="Data Points"
          value={stats.dataPoints}
          trend="up"
          icon="📈"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Risk Level Distribution</h2>
          {/* Add your RiskGraph component here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add activity list/table here */}
        </div>
      </div>
    </div>
  );
}