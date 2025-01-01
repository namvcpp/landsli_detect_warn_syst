'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notificationEmail: '',
    alertThreshold: 70,
  });

  const handleSaveSettings = () => {
    // Save settings (dummy implementation for now)
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Admin Settings</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Notification Email</label>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Alert Threshold</label>
            <input
              type="number"
              value={settings.alertThreshold}
              onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button 
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
