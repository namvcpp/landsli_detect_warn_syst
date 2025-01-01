'use client';
import { useState } from 'react';
import { saveAs } from 'file-saver';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any[]>([]);

  const handleGenerateReport = () => {
    // Generate report data (dummy data for now)
    const data = [
      { id: 1, name: 'Report 1', date: new Date().toISOString() },
      { id: 2, name: 'Report 2', date: new Date().toISOString() },
    ];
    setReportData(data);
  };

  const handleDownloadReport = (report: any) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, `${report.name}-${report.date}.json`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      <button 
        onClick={handleGenerateReport}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate Report
      </button>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Generated Reports</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {reportData.map((report) => (
              <li key={report.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span>{report.name}</span>
                <button 
                  onClick={() => handleDownloadReport(report)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
