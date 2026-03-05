'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { calculateTotalExerciseDeficit } from '@/lib/physio-logic';
import { Target, TrendingDown, Flame } from 'lucide-react';

export default function MilestoneSidebar() {
  const { params, schedule } = useStore();
  
  if (!params || schedule.length === 0) return null;

  const totalDeficit = calculateTotalExerciseDeficit(params);
  const milestones = schedule.filter(d => d.isMilestone);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit space-y-8 min-w-[300px]">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <TrendingDown className="text-blue-500" /> Plan Summary
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium uppercase tracking-wider">Total Goal</div>
            <div className="text-2xl font-bold text-blue-900">
              {params.currentWeight} → {params.targetWeight} kg
            </div>
            <div className="text-xs text-blue-500 mt-1">Total Loss: {params.currentWeight - params.targetWeight} kg</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-600 font-medium uppercase tracking-wider">Total Exercise Debt</div>
            <div className="text-2xl font-bold text-orange-900">
              {totalDeficit.toLocaleString()} kcal
            </div>
            <div className="text-xs text-orange-500 mt-1">Across {schedule.length} days</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Target className="text-amber-500" /> Milestones
        </h2>
        <div className="relative border-l-2 border-amber-100 ml-3 pl-6 space-y-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
              <div className="text-xs font-bold text-amber-600 uppercase">
                {idx === 3 ? 'Final Target' : `Phase ${idx + 1}`}
              </div>
              <div className="text-lg font-bold text-gray-800">
                {m.milestoneWeight} kg
              </div>
              <div className="text-xs text-gray-500">
                by {new Date(m.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
