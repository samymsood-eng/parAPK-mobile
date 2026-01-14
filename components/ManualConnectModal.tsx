
import React, { useState } from 'react';
import { X, Monitor, Globe, Link, ArrowLeft, Loader2, ShieldCheck, Zap } from 'lucide-react';

interface ManualConnectModalProps {
  onConnect: (target: string) => void;
  onClose: () => void;
}

const ManualConnectModal: React.FC<ManualConnectModalProps> = ({ onConnect, onClose }) => {
  const [ip, setIp] = useState('192.168.1.');
  const [port, setPort] = useState('8080');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    
    // محاكاة فحص المسار
    setTimeout(() => {
      onConnect(`${ip}:${port}`);
      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center flex-row-reverse bg-slate-900/50">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20">
              <Link size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">ربط يدوي مخصص</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Manual Node Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2 text-right">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">عنوان الـ IP للجهاز</label>
              <div className="relative group">
                <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" required value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pr-12 pl-4 text-white text-right text-sm outline-none focus:border-blue-500 font-mono tracking-widest"
                  placeholder="0.0.0.0"
                />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">المنفذ (Port)</label>
              <div className="relative group">
                <Monitor size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" required value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pr-12 pl-4 text-white text-right text-sm outline-none focus:border-blue-500 font-mono tracking-widest"
                  placeholder="8080"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[10px] font-bold text-slate-400">الارتباط النهائي</span>
            </div>
            <span className="text-[11px] font-mono text-blue-400">{ip}:{port}</span>
          </div>

          <button 
            type="submit" disabled={isChecking}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-[1.5rem] font-black text-base shadow-xl shadow-blue-900/30 flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
          >
            {isChecking ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
            <span>تأسيس الارتباط الآن</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualConnectModal;
