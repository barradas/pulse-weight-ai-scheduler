'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { calculateTotalExerciseDeficit } from '@/lib/physio-logic';
import { Target, BarChart3, Flame } from 'lucide-react';

export default function MilestoneSidebar() {
  const { params, schedule } = useStore();
  
  if (!params || schedule.length === 0) return null;

  const totalDeficit = calculateTotalExerciseDeficit(params);
  const milestones = schedule.filter(d => d.isMilestone);

  return (
    <div className="bg-surface border border-border h-fit divide-y divide-border animate-fade-up">
      {/* Plan Header */}
      <div className="p-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
          <BarChart3 size={14} /> Mission Objectives
        </h3>
        
        <div className="space-y-6">
          <div className="relative group">
            <div className="text-[10px] font-black uppercase text-zinc-600 mb-1 group-hover:text-accent transition-colors">Net Weight Goal</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic tracking-tighter italic tabular-nums">{params.currentWeight}</span>
              <span className="text-zinc-500 text-xs font-bold uppercase italic">→</span>
              <span className="text-4xl font-black italic tracking-tighter italic text-accent tabular-nums">{params.targetWeight}</span>
              <span className="text-zinc-600 text-xs font-bold uppercase ml-1">KG</span>
            </div>
            {/* Progress bar background */}
            <div className="mt-3 h-[2px] w-full bg-zinc-800">
               <div className="h-full bg-accent w-1/4 group-hover:w-full transition-all duration-1000" />
            </div>
          </div>

          <div className="relative">
             <div className="text-[10px] font-black uppercase text-zinc-600 mb-1">Estimated Energy Deficit</div>
             <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black italic tracking-tighter text-white tabular-nums">{totalDeficit.toLocaleString()}</span>
               <span className="text-zinc-600 text-xs font-black uppercase tracking-widest">KCAL</span>
             </div>
             <div className="text-[9px] font-bold text-zinc-600 uppercase mt-1">Calculated over {schedule.length} active cycles</div>
          </div>
        </div>
      </div>

      {/* Progress Phases */}
      <div className="p-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
          <Target size={14} /> Phase Milestones
        </h3>
        
        <div className="space-y-10 relative ml-2">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 w-[1px] h-[calc(100%-10px)] bg-zinc-800" />
          
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-6 group">
              {/* Dot */}
              <div className={`absolute -left-[3px] top-1.5 w-[6px] h-[6px] rounded-full transition-all duration-300 ${
                idx === 3 ? 'bg-accent glow-accent scale-150' : 'bg-zinc-700 group-hover:bg-zinc-400'
              }`} />
              
              <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                   idx === 3 ? 'text-accent' : 'text-zinc-600'
                }`}>
                  {idx === 3 ? 'FINAL TARGET' : `PHASE 0${idx + 1}`}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black italic tracking-tighter text-white tabular-nums group-hover:text-accent transition-colors">
                    {m.milestoneWeight}
                  </span>
                  <span className="text-zinc-600 text-[10px] font-bold uppercase">KG</span>
                </div>
                <span className="text-[10px] font-medium text-zinc-500 mt-1 italic">
                  ETD: {new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Target Summary */}
      <div className="p-6 bg-zinc-900/20">
        <div className="flex items-center gap-2 mb-4">
           <Flame size={14} className="text-orange-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Daily Burn Target</span>
        </div>
        <div className="text-3xl font-black italic tracking-tighter text-white tabular-nums mb-1">
          {Math.round(schedule.reduce((acc, d) => acc + d.caloriesBurned, 0) / schedule.length)}
          <span className="text-zinc-600 text-xs not-italic font-black ml-2 uppercase tracking-widest">KCAL/DAY</span>
        </div>
        <p className="text-[10px] font-medium text-zinc-600 italic">Average requirement to maintain trajectory.</p>
      </div>
    </div>
  );
}
