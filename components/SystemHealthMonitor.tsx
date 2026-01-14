
import React, { useState } from 'react';
import { Activity, ShieldCheck, RefreshCw, AlertTriangle, Zap, Cpu, Wrench } from 'lucide-react';
import { SystemHealth } from '../types';

interface SystemHealthMonitorProps {
  health: SystemHealth;
  onManualRepair?: () => void;
}

const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({ health, onManualRepair }) => {
  const [isRepairing, setIsRepairing] = useState(false);

  const handleRepair = () => {
    setIsRepairing(true);
    if (onManualRepair) onManualRepair();
    setTimeout(() => setIsRepairing(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-row-reverse mb-6">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className={`p-2 rounded-xl border ${health.status === 'optimal' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
            <ShieldCheck size={20} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">نظام الحماية الذاتية</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Self-Repairing Protocol Active</p>
          </div>
        </div>
        <button 
          onClick={handleRepair}
          disabled={isRepairing}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg border border-slate-700 transition-all active:scale-90 disabled:opacity-50"
          title="بدء فحص وإصلاح يدوي"
        >
          <Wrench size={14} className={isRepairing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center gap-2 text-center group">
          <RefreshCw size={18} className={`text-blue-500 ${isRepairing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase block">عمليات الإصلاح</span>
            <span className="text-sm font-black text-white">{health.autoFixedIssues}</span>
          </div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center gap-2 text-center">
          <Cpu size={18} className="text-amber-500" />
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-slate-500 uppercase block">استقرار النواة</span>
            <span className="text-sm font-black text-white">100%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-black text-slate-600 uppercase pr-1 mb-2 text-right">أدوات الصيانة النشطة</p>
        <div className="flex flex-wrap gap-2 flex-row-reverse">
          {health.activeModules.map((module, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-[8px] font-bold text-slate-400 flex items-center gap-1.5">
              <Zap size={8} className="text-blue-500" /> {module}
            </span>
          ))}
        </div>
      </div>

      {(health.status === 'repairing' || isRepairing) && (
        <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center gap-3 flex-row-reverse animate-pulse">
          <RefreshCw size={14} className="text-blue-500 animate-spin" />
          <span className="text-[9px] font-bold text-blue-400">جاري إعادة تهيئة الطبقات الأمنية...</span>
        </div>
      )}
    </div>
  );
};

export default SystemHealthMonitor;
