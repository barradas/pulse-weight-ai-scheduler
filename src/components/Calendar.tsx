'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { format, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Bike, Footprints, Coffee, Target } from 'lucide-react';

export default function Calendar() {
  const schedule = useStore((state) => state.schedule);
  
  if (schedule.length === 0) return null;

  // For simplicity, we'll show all days in the schedule range
  // In a real app, you might want to group by month
  const startDate = schedule[0].date;
  const endDate = schedule[schedule.length - 1].date;

  const getWorkoutForDate = (date: Date) => {
    return schedule.find(s => isSameDay(new Date(s.date), date));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Workout Calendar</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1"><Footprints size={16} className="text-blue-500"/> Running</div>
          <div className="flex items-center gap-1"><Bike size={16} className="text-green-500"/> Cycling</div>
          <div className="flex items-center gap-1"><Coffee size={16} className="text-gray-400"/> Rest</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedule.map((day, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-lg border-2 transition-all ${
              day.isMilestone ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-600">
                {format(new Date(day.date), 'EEE, MMM d')}
              </span>
              {day.isMilestone && (
                <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Target size={10} /> MILESTONE
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-full ${
                day.type === 'running' ? 'bg-blue-100 text-blue-600' :
                day.type === 'cycling' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {day.type === 'running' ? <Footprints size={20} /> :
                 day.type === 'cycling' ? <Bike size={20} /> :
                 <Coffee size={20} />}
              </div>
              <div>
                <div className="font-bold text-gray-800 capitalize">{day.type}</div>
                {day.type !== 'rest' && (
                  <div className="text-xs text-gray-500">{day.durationMinutes} mins • {day.distanceKm} km</div>
                )}
              </div>
            </div>

            {day.type !== 'rest' && (
              <div className="text-sm font-medium text-gray-600 mt-2">
                Burn: <span className="text-orange-600">{day.caloriesBurned} kcal</span>
              </div>
            )}

            {day.isMilestone && (
              <div className="mt-3 pt-3 border-t border-amber-200 text-sm font-bold text-amber-800">
                Target Weight: {day.milestoneWeight} kg
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
