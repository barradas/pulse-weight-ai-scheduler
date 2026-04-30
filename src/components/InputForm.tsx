'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { PhysioParams } from '@/lib/physio-logic';
import { addDays, format } from 'date-fns';
import { ChevronRight, Weight, Calendar as CalendarIcon, User } from 'lucide-react';

export default function InputForm() {
  const setParams = useStore((state) => state.setParams);
  const [formData, setFormData] = useState({
    currentWeight: 80,
    targetWeight: 75,
    targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    age: 30,
    gender: 'male' as 'male' | 'female',
    height: 180,
    intensityPreference: 'low' as 'high' | 'low'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: PhysioParams = {
      ...formData,
      startDate: new Date(),
      targetDate: new Date(formData.targetDate)
    };
    setParams(params);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'gender' || name === 'intensityPreference' || name === 'targetDate' ? value : Number(value)
    }));
  };

  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit} 
      className="bg-surface p-8 rounded-none border border-border max-w-xl w-full relative animate-fade-up"
    >
      {/* Decorative Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-accent glow-accent" />
      
      <div className="mb-10">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2 italic">Performance Setup</h2>
        <div className="h-1 w-12 bg-accent" />
      </div>
      
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
            <Weight size={14} /> Metrics
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-accent transition-colors">Current Weight (kg)</label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 text-2xl font-black focus:border-accent outline-none transition-all placeholder:text-zinc-700"
                required
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-accent transition-colors">Target Weight (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 text-2xl font-black focus:border-accent outline-none transition-all placeholder:text-zinc-700"
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
            <CalendarIcon size={14} /> Timeline
          </div>
          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-accent transition-colors">Target Deadline</label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 text-xl font-bold focus:border-accent outline-none transition-all"
              required
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
            <User size={14} /> Physiology
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-accent transition-colors">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 text-xl font-bold focus:border-accent outline-none transition-all"
                required
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-accent transition-colors">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 text-xl font-bold focus:border-accent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 font-bold focus:border-accent outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="male">MALE</option>
                <option value="female">FEMALE</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Protocol Intensity</label>
              <select
                name="intensityPreference"
                value={formData.intensityPreference}
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border-b border-zinc-800 p-3 font-bold focus:border-accent outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="low">LOW INTENSITY</option>
                <option value="high">HIGH INTENSITY</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="group w-full mt-12 bg-accent text-black font-black italic uppercase tracking-tighter py-5 text-xl transition-all hover:bg-[#e6ff4d] flex items-center justify-center gap-2 slant-clip active:scale-[0.98]"
      >
        Calculate Protocol <ChevronRight className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.form>
  );
}
