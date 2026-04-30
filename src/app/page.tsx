'use client';

import { useEffect, useState } from 'react';
import InputForm from '@/components/InputForm';
import Calendar from '@/components/Calendar';
import MilestoneSidebar from '@/components/MilestoneSidebar';
import { useStore, loadFromLocalStorage } from '@/lib/store';
import { Activity, Trash2, Download, Zap, RefreshCw } from 'lucide-react';

export default function Home() {
  const { params, schedule, reset } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('pulseweight-params');
    if (saved) {
      loadFromLocalStorage();
    }
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
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 relative z-10">
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-accent p-3 slant-clip text-black shadow-[0_0_20px_rgba(212,255,0,0.3)]">
              <Zap size={28} className="fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-[900] italic uppercase tracking-tighter text-white">
                PulseWeight <span className="text-accent">OS</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-[2px] bg-accent" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                   Tactical Exercise Scheduler v2.0
                 </p>
              </div>
            </div>
          </div>

          {params && (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={exportSchedule}
                className="group flex items-center gap-2 bg-zinc-900 border border-border hover:border-accent text-zinc-400 hover:text-accent px-6 py-2 transition-all font-black text-[10px] uppercase tracking-widest slant-clip"
              >
                <Download size={14} /> Export Protocol
              </button>
              <button
                onClick={reset}
                className="group flex items-center gap-2 bg-zinc-900 border border-border hover:border-red-500/50 text-zinc-400 hover:text-red-500 px-6 py-2 transition-all font-black text-[10px] uppercase tracking-widest slant-clip"
              >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Reset Plan
              </button>
            </div>
          )}
        </header>

        {/* Content Matrix */}
        {!params ? (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 py-12">
            <div className="max-w-2xl animate-fade-up">
              <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Optimization Engine</span>
              <h2 className="text-6xl lg:text-8xl font-[900] italic uppercase tracking-tighter text-white leading-[0.85] mb-8">
                Build your <br />
                <span className="text-zinc-800">Prime</span> <br />
                Physique.
              </h2>
              <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-lg mb-10 border-l-2 border-zinc-800 pl-8">
                Engineered for those who refuse to settle. Input your metrics and generate a scientifically-backed training protocol.
              </p>
              <div className="flex gap-12 text-zinc-600">
                 <div>
                    <div className="text-2xl font-black italic tracking-tighter text-zinc-400 mb-1">M-SJ</div>
                    <div className="text-[9px] font-black uppercase tracking-widest">Logic Model</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black italic tracking-tighter text-zinc-400 mb-1">7700</div>
                    <div className="text-[9px] font-black uppercase tracking-widest">Kcal Efficiency</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black italic tracking-tighter text-zinc-400 mb-1">24/7</div>
                    <div className="text-[9px] font-black uppercase tracking-widest">Tracking</div>
                 </div>
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <InputForm />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-1 relative">
            {/* Grid background effect */}
            <div className="absolute inset-0 border border-zinc-800 pointer-events-none opacity-20" 
                 style={{backgroundImage: 'radial-gradient(circle, #262626 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            
            <div className="order-2 lg:order-1 lg:pr-12 py-8 relative z-10">
              <Calendar />
            </div>
            
            <aside className="order-1 lg:order-2 py-8 relative z-10">
              <div className="sticky top-8 space-y-8">
                <MilestoneSidebar />
                
                {/* Tactical Notice */}
                <div className="p-8 border border-accent/20 bg-accent/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-accent opacity-5 rotate-45 transform translate-x-8 translate-y-[-8px]" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3 flex items-center gap-2">
                    <Zap size={12} className="fill-current" /> Technical Advisory
                  </h4>
                  <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">
                    The generated schedule assumes a neutral caloric intake. To maximize metabolic efficiency, maintain high protein intake and consistent sleep cycles.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Tactical Footer */}
        <footer className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
            © 2026 PulseWeight OS // High-Performance Division
          </div>
          <div className="flex gap-8">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">Protocol 01: Running</span>
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">Protocol 02: Cycling</span>
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">Security: Verified</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
