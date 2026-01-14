
import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password?: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    
    // محاكاة سريعة للدخول
    setTimeout(() => {
      const success = onLogin(formData.username, formData.password);
      if (!success) {
        setError(true);
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">مركز الجمهورية الذكي</h1>
            <p className="text-slate-500 text-xs uppercase tracking-widest">تسجيل الدخول للنظام</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 text-red-400 text-xs flex-row-reverse text-right">
                <AlertCircle size={16} />
                <span>البيانات غير صحيحة، يرجى المحاولة مرة أخرى.</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1 block text-right">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pr-12 pl-4 text-white text-right text-sm outline-none focus:border-blue-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1 block text-right">كلمة السر</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password" required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pr-12 pl-4 text-white text-right text-sm outline-none focus:border-blue-500 font-mono"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><span>دخول النظام</span><ArrowLeft size={20} /></>}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-800 text-center">
             <div className="flex items-center justify-center gap-2 text-slate-600">
                <ShieldCheck size={14} />
                <p className="text-[9px] font-bold uppercase tracking-widest">Republic Smart System v2.5</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
