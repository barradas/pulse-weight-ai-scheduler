'use client';

import { useEffect, useState } from 'react';
import InputForm from '@/components/InputForm';
import Calendar from '@/components/Calendar';
import MilestoneSidebar from '@/components/MilestoneSidebar';
import { useStore, loadFromLocalStorage } from '@/lib/store';
import { Activity, Trash2, Download } from 'lucide-react';

export default function Home() {
  const { params, schedule, reset } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFromLocalStorage();
  }, []);

  const exportSchedule = () => {
    const data = JSON.stringify({ params, schedule }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-weight-plan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl">
              <Activity size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">PulseWeight <span className="text-blue-600">AI</span></h1>
              <p className="text-sm text-gray-500 font-medium">Precision-Engineered Workout Scheduler</p>
            </div>
          </div>

          {params && (
            <div className="flex gap-4">
              <button
                onClick={exportSchedule}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-all font-semibold"
              >
                <Download size={18} /> Export JSON
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all font-semibold"
              >
                <Trash2 size={18} /> Reset Plan
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        {!params ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-8 text-center max-w-lg">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">Start Your Journey</h2>
              <p className="text-gray-600">Enter your current metrics and goals, and our algorithm will build a custom weight-loss schedule optimized for your physiology.</p>
            </div>
            <InputForm />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            <div className="order-2 lg:order-1">
              <Calendar />
            </div>
            <aside className="order-1 lg:order-2 space-y-6">
              <MilestoneSidebar />
              {/* Extra Stats Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Daily Targets</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg. Daily Burn</span>
                    <span className="font-bold text-gray-800">
                      {Math.round(schedule.reduce((acc, d) => acc + d.caloriesBurned, 0) / schedule.length)} kcal
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500">Weekly Total</span>
                    <span className="font-bold text-gray-800">
                      {Math.round(schedule.slice(0, 7).reduce((acc, d) => acc + d.caloriesBurned, 0))} kcal
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-gray-200 text-center text-gray-400 text-xs">
          <p>© 2026 PulseWeight AI. Powered by Mifflin-St Jeor metabolic logic.</p>
        </footer>
      </div>
    </main>
  );
}
