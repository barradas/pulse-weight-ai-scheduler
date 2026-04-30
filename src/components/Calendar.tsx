'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { Bike, Footprints, Coffee, Target, Timer, Map } from 'lucide-react';

export default function Calendar() {
  const schedule = useStore((state) => state.schedule);
  const toggleDayStatus = useStore((state) => state.toggleDayStatus);
  
  if (schedule.length === 0) return null;

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter italic">Training Log</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Daily Performance Breakdown</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:glow-accent transition-all" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Run</span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cycle</span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rest</span>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1"
      >
        {schedule.map((day, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, borderColor: 'var(--color-accent)' }}
            transition={{ duration: 0.3 }}
            onClick={() => toggleDayStatus(day.date)}
            className={`group p-6 border transition-all duration-300 relative overflow-hidden cursor-pointer ${
              day.status === 'completed' ? 'bg-accent/10 border-accent/40 shadow-[0_0_20px_rgba(212,255,0,0.1)]' :
              day.status === 'missed' ? 'bg-red-500/5 border-red-500/20 grayscale' :
              day.isMilestone ? 'bg-accent/5 border-accent/20' : 
              'bg-surface border-border hover:bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            {/* Background Texture for Milestone */}
            {day.isMilestone && (
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Target size={80} className="text-accent" />
              </div>
            )}

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
                  {format(new Date(day.date), 'EEEE')}
                </div>
                <div className="text-xl font-black tabular-nums tracking-tighter">
                   {format(new Date(day.date), 'MMM d')}
                </div>
              </div>
              {day.isMilestone ? (
                <div className="bg-accent text-black text-[9px] font-black px-2 py-0.5 slant-clip italic">
                  TARGET CHECK-IN
                </div>
              ) : (
                <div className={`text-[9px] font-black px-2 py-0.5 slant-clip italic ${
                  day.status === 'completed' ? 'bg-accent text-black' : 
                  day.status === 'missed' ? 'bg-red-500 text-white' : 
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {day.status.toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className={`p-4 ${
                day.type === 'running' ? 'bg-blue-600 text-white' :
                day.type === 'cycling' ? 'bg-accent text-black' :
                'bg-zinc-800 text-zinc-500'
              } slant-clip`}>
                {day.type === 'running' ? <Footprints size={24} /> :
                 day.type === 'cycling' ? <Bike size={24} /> :
                 <Coffee size={24} />}
              </div>
              <div>
                <div className="text-lg font-black uppercase italic tracking-tighter">
                  {day.type === 'rest' ? 'RECOVERY' : day.type}
                </div>
                {day.type !== 'rest' && (
                  <div className="flex gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                      <Timer size={12} className="text-zinc-600" /> {day.durationMinutes}M
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                      <Map size={12} className="text-zinc-600" /> {day.distanceKm}KM
                    </div>
                  </div>
                )}
              </div>
            </div>

            {day.type !== 'rest' ? (
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/50 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Expected Burn</span>
                  <span className="text-lg font-black italic text-accent tabular-nums">-{day.caloriesBurned} <span className="text-[10px] not-italic">KCAL</span></span>
                </div>
                {day.isMilestone && (
                  <div className="flex flex-col border-l border-zinc-800/50 pl-4">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Target Weight</span>
                    <span className="text-lg font-black italic text-white tabular-nums">{day.milestoneWeight} <span className="text-[10px] not-italic">KG</span></span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-zinc-800/50 relative z-10">
                 <p className="text-[10px] font-medium text-zinc-600 leading-relaxed italic">
                   Active recovery phase. Focus on mobility and nutrition for next-day output.
                 </p>
              </div>
            )}
            
            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
