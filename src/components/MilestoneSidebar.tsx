'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { calculateTotalExerciseDeficit, calculateMacros } from '@/lib/physio-logic';
import { format } from 'date-fns';
import { Target, BarChart3, Flame } from 'lucide-react';

export default function MilestoneSidebar() {
  const { params, schedule } = useStore();
  
  if (!params || schedule.length === 0) return null;

  const totalDeficit = calculateTotalExerciseDeficit(params);
  const completedCalories = schedule
    .filter(d => d.status === 'completed')
    .reduce((acc, d) => acc + d.caloriesBurned, 0);
  
  const progressPercent = (completedCalories / totalDeficit) * 100;
  const milestones = schedule.filter(d => d.isMilestone);

  return (
    <div className="bg-surface border border-border h-fit divide-y divide-border animate-fade-up">
      {/* Plan Header */}
      <div className="p-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
          <BarChart3 size={14} /> Mission Progress
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
            <div className="mt-3 h-[2px] w-full bg-zinc-800 relative overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, progressPercent)}%` }}
                 className="h-full bg-accent shadow-[0_0_10px_#d4ff00]" 
               />
            </div>
            <div className="flex justify-between mt-1">
               <span className="text-[8px] font-bold text-zinc-600 uppercase">Burn Progress</span>
               <span className="text-[8px] font-bold text-accent uppercase">{Math.round(progressPercent)}%</span>
            </div>
          </div>

          <div className="relative">
             <div className="text-[10px] font-black uppercase text-zinc-600 mb-1">Energy Deficit: <span className="text-accent">{completedCalories.toLocaleString()}</span> / {totalDeficit.toLocaleString()}</div>
             <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black italic tracking-tighter text-white tabular-nums">{(totalDeficit - completedCalories).toLocaleString()}</span>
               <span className="text-zinc-600 text-xs font-black uppercase tracking-widest">KCAL REMAINING</span>
             </div>
             <div className="text-[9px] font-bold text-zinc-600 uppercase mt-1">Targeting {params.targetWeight}kg by {format(params.targetDate, 'MMM d, yyyy')}</div>
          </div>

          {/* Trajectory Mini-Chart */}
          <div className="pt-4 h-24 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 200 60">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d4ff00" stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="10" x2="200" y2="10" stroke="#262626" strokeWidth="0.5" />
              <line x1="0" y1="30" x2="200" y2="30" stroke="#262626" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="200" y2="50" stroke="#262626" strokeWidth="0.5" />
              
              {/* Trajectory Line */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M 10 15 L 60 25 L 110 35 L 160 45 L 190 50" 
                fill="none" 
                stroke="url(#lineGradient)" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              
              {/* Data Points */}
              <circle cx="10" cy="15" r="3" fill="#262626" stroke="#d4ff00" strokeWidth="1" />
              <circle cx="190" cy="50" r="4" fill="#d4ff00" />
            </svg>
            <div className="flex justify-between mt-1 px-1">
               <span className="text-[8px] font-bold text-zinc-600 uppercase">START</span>
               <span className="text-[8px] font-bold text-accent uppercase">TARGET</span>
            </div>
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
        <p className="text-[10px] font-medium text-zinc-600 italic mb-8">Average requirement to maintain trajectory.</p>

        {/* Fuel Matrix */}
        {(() => {
          const nextPlanned = schedule.find(d => d.status === 'planned') || schedule[schedule.length - 1];
          const macros = calculateMacros(params, nextPlanned.type);
          return (
            <div className="pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Fuel Matrix</span>
                <span className="text-[9px] font-bold text-accent px-2 py-0.5 bg-accent/10 slant-clip italic">
                  {nextPlanned.type.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900/50 p-3 rounded-none border border-zinc-800">
                  <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">PRO</div>
                  <div className="text-lg font-black text-white italic tabular-nums">{macros.protein}g</div>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-none border border-zinc-800">
                  <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">CARB</div>
                  <div className="text-lg font-black text-white italic tabular-nums">{macros.carbs}g</div>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-none border border-zinc-800">
                  <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">FAT</div>
                  <div className="text-lg font-black text-white italic tabular-nums">{macros.fats}g</div>
                </div>
              </div>
              <div className="mt-3 text-[9px] font-medium text-zinc-600 italic">
                Target Intake: {macros.totalCalories} kcal. Maintain this baseline to fuel performance while burning fat via activity.
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
