"use client"; // This is critical for Recharts to work in Next.js!

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// This is our dummy data. You can change these numbers to whatever you want!
const data = [
  { name: 'Python', hours: 100 },
  { name: 'C++', hours: 30 },
  { name: 'JavaScript', hours: 30 },
  { name: 'React', hours: 15 },
  { name: 'SQL', hours: 45 },
  { name: 'Java (OOP)', hours: 35 },
  
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-4 text-green-400">Skills Overview</h1>
        <p className="text-gray-400 mb-8">
          A visualization of my coding experience. Built with Recharts.
        </p>
        
        {/* Chart Container */}
        <div className="h-[400px] w-full bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                cursor={{ fill: '#374151' }}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="hours" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </main>
  );
}
