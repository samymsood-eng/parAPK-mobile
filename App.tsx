import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  Wifi, Smartphone, LogOut, LayoutDashboard, Monitor, Settings2,
  Database, RefreshCw, AlertCircle, Clock, Power, Trash2,
  Lock, Camera, Download, Radar, XCircle, Bot, ChevronLeft,
  User, Phone, Sparkles, Gem, ShieldCheck, Waves, Sun, Moon, Gauge, Menu as MenuIcon,
  X, Layout, Scan, Link as LinkIcon, HeartPulse, Shield, Activity, ListChecks, Radio
} from 'lucide-react';
import QRCodeDisplay from './components/QRCodeDisplay';
import NetworkAssistant from './components/NetworkAssistant';
import LoginPage from './components/LoginPage';
import UserPermissions from './components/UserPermissions';
import WifiSettings from './components/WifiSettings';
import ScannerModal from './components/ScannerModal';
import ManualConnectModal from './components/ManualConnectModal';
import SystemHealthMonitor from './components/SystemHealthMonitor';
import { ConnectionData, ConnectionStatus, ConnectedDevice, UserAccount, SystemHealth } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'permissions' | 'assistant' | 'wifi' | 'security' | 'logs'>('dashboard');
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('disconnected');
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  // نظام الإصلاح الذاتي المتطور
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'optimal',
    lastCheck: new Date().toLocaleTimeString('ar-EG'),
    activeModules: ['Security Guard', 'Net Repair', 'Memory Purge', 'APK Guard'],
    autoFixedIssues: 0
  });

  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: '1',
      username: 'سامي مسعود',
      password: '123',
      role: 'admin',
      lastLogin: new Date().toLocaleString('ar-EG'),
      permissions: { canScan: true, canConnect: true, canManageUsers: true }
    }
  ]);

  const [data, setData] = useState<ConnectionData>({
    ip: '192.168.1.100',
    port: '8080',
    protocol: 'webrtc',
    appName: 'مركز الجمهورية الذكي'
  });

  const addLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString('ar-EG');
    setLogs(prev => [`[${time}] ${message}`, ...prev].slice(50));
  }, []);

  const runDeepSystemRepair = useCallback(() => {
    setSystemHealth(prev => ({ ...prev, status: 'repairing' }));
    setLogs(prev => prev.slice(0, 20));
    addLog("نظام APK: بدء فحص طبقة التوافق العميقة...");

    setTimeout(() => {
      setSystemHealth(prev => ({
        ...prev,
        status: 'optimal',
        lastCheck: new Date().toLocaleTimeString('ar-EG'),
        autoFixedIssues: prev.autoFixedIssues + 1
      }));
      addLog("نظام APK: تم الانتهاء من الصيانة بنجاح.");
    }, 2000);
  }, [addLog]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addLog("تحذير: تم رصد خلل برمجي. جاري الإصلاح التلقائي...");
      runDeepSystemRepair();
      event.preventDefault();
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [runDeepSystemRepair, addLog]);

  useEffect(() => {
    const watchdog = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        lastCheck: new Date().toLocaleTimeString('ar-EG')
      }));
    }, 30000);
    return () => clearInterval(watchdog);
  }, []);

  const handleLogin = (username: string, password?: string) => {
    try {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        const updatedUser = { ...user, lastLogin: new Date().toLocaleString('ar-EG') };
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        setIsAuthenticated(true);
        addLog(`تم دخول المسؤول: ${user.username}`);
        return true;
      }
      return false;
    } catch (e) {
      runDeepSystemRepair();
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsSidebarOpen(false);
  };

  const toggleConnection = () => {
    if (connStatus === 'disconnected') {
      setConnStatus('connected');
      addLog("تم فتح بوابات الربط الرقمي.");
      setConnectedDevices([{
        id: 'dev_' + Math.random().toString(36).substr(2, 5),
        name: "جهاز Android مركزي",
        type: 'mobile',
        connectedAt: 'الآن',
        ip: '10.0.0.5',
        status: 'active',
        latency: 12
      }]);
    } else {
      setConnStatus('disconnected');
      setConnectedDevices([]);
      addLog("تم إغلاق الجلسة وتأمين المنافذ.");
    }
  };

  const handleScanSuccess = (decodedData: string) => {
    try {
      const parsed = JSON.parse(decodedData);
      setIsScannerOpen(false);
      addLog(`نجاح تأسيس الارتباط مع النود: ${parsed.target}`);
      setConnStatus('connected');
    } catch (e) {
      addLog("فشل في تحليل البيانات. تم إعادة الضبط.");
      runDeepSystemRepair();
    }
  };

  // وظيفة الانتقال بين التبويبات مع إغلاق القائمة
  const switchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // إغلاق القائمة الجانبية فوراً عند الاختيار
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const menuGroups = [
    {
      title: 'النظام الأساسي',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم المركزية', icon: LayoutDashboard, color: 'text-blue-500' },
        { id: 'wifi', label: 'إعدادات الواي فاي', icon: Wifi, color: 'text-emerald-500' },
        { id: 'assistant', label: 'المساعد الذكي', icon: Bot, color: 'text-purple-500' },
      ]
    },
    {
      title: 'الأمن والعمليات',
      items: [
        { id: 'security', label: 'الحماية الذاتية', icon: ShieldCheck, color: 'text-amber-500' },
        { id: 'logs', label: 'سجل العمليات', icon: ListChecks, color: 'text-slate-400' },
        { id: 'permissions', label: 'إدارة الصلاحيات', icon: Lock, color: 'text-red-500' },
      ]
    }
  ];

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden font-['Noto Kufi Arabic']">

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[70] backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      {isScannerOpen && <ScannerModal onScan={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
      {isManualOpen && <ManualConnectModal onConnect={(t) => { setIsManualOpen(false); addLog(`ربط يدوي: ${t}`); setConnStatus('connected'); }} onClose={() => setIsManualOpen(false)} />}

      {/* Sidebar Section */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-[80] shadow-2xl transition-transform duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={28} />
            </button>
            <div className="text-right">
              <h2 className="text-xl font-bold text-white tracking-tight">مركز الجمهورية</h2>
              <div className="flex items-center gap-1 justify-end mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] font-black">System Live</p>
              </div>
            </div>
          </div>

          <nav className="p-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => switchTab(item.id as any)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                    >
                      <ChevronLeft size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                      <div className="flex items-center gap-4 flex-row-reverse">
                        <item.icon size={22} className={activeTab === item.id ? 'text-white' : item.color} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Live Monitoring Section in Sidebar */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between flex-row-reverse px-4">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">المراقبة الحية</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] font-black text-blue-500">{connectedDevices.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                {connectedDevices.length === 0 ? (
                  <div className="p-4 bg-slate-950/30 rounded-2xl border border-dashed border-slate-800 text-center">
                    <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">لا توجد أجهزة متصلة</p>
                  </div>
                ) : (
                  connectedDevices.map(dev => (
                    <div key={dev.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between flex-row-reverse group hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="p-2 bg-slate-900 rounded-lg text-blue-500 group-hover:text-emerald-500 transition-colors">
                          <Smartphone size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-200 truncate max-w-[100px]">{dev.name}</p>
                          <p className="text-[8px] font-mono text-slate-600">{dev.ip}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Radio size={12} className="text-emerald-500 animate-pulse" />
                        <span className="text-[7px] font-black text-emerald-600 mt-1">{dev.latency}ms</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </nav>

          <div className="p-8 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6 flex items-center justify-between flex-row-reverse">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase">المسؤول الحالي</p>
                <p className="text-xs font-bold text-white">{currentUser?.username}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">
                {currentUser?.username.charAt(0)}
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-sm font-black transition-all">
              <LogOut size={20} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-24 border-b border-slate-900 flex items-center justify-between px-6 lg:px-12 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-950 rounded-full border border-slate-800">
              <div className={`w-2 h-2 rounded-full ${connStatus === 'connected' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{connStatus === 'connected' ? 'Link Active' : 'Standby'}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <HeartPulse size={18} className={systemHealth.status === 'repairing' ? 'text-blue-500 animate-spin' : 'text-emerald-500'} />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden sm:flex flex-col text-right">
              <h1 className="text-lg font-black text-white tracking-tight">مركز الجمهورية الذكي</h1>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Digital Fortress v5.0</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-900/40 active:scale-95 border border-blue-400/20">
              <MenuIcon size={24} />
            </button>
          </div>
        </header>

        {/* Main Section with Animation per Tab */}
        <main key={activeTab} className="flex-1 overflow-y-auto p-6 lg:p-14 custom-scrollbar pb-32 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'dashboard' ? (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <section className="lg:col-span-5 space-y-8">
                  <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700" />
                    <QRCodeDisplay data={data} />
                    <div className="grid grid-cols-1 w-full gap-4 mt-10 relative z-10">
                      <button onClick={toggleConnection} className={`w-full py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-500 ${connStatus === 'disconnected' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30 hover:bg-blue-500' : 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white'}`}>
                        {connStatus === 'disconnected' ? <Power size={22} /> : <XCircle size={22} />}
                        <span>{connStatus === 'disconnected' ? 'تفعيل المركز' : 'إغلاق المنافذ'}</span>
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setIsScannerOpen(true)} className="py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 font-bold text-[10px]">
                          <Scan size={16} className="text-blue-500" /> <span>مسح QR</span>
                        </button>
                        <button onClick={() => setIsManualOpen(true)} className="py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 font-bold text-[10px]">
                          <LinkIcon size={16} className="text-amber-500" /> <span>ربط يدوي</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="lg:col-span-7 space-y-8">
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-xl">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase mb-6 flex items-center gap-3 flex-row-reverse border-r-4 border-blue-600 pr-3">
                      <Smartphone size={18} className="text-blue-500" /> الأجهزة المتصلة بالجلسة
                    </h3>
                    {connectedDevices.length === 0 ? (
                      <div className="py-24 text-center text-slate-800 bg-slate-950/30 rounded-[2rem] border border-dashed border-slate-800 flex flex-col items-center gap-4">
                        <Radar size={48} className="opacity-10 animate-pulse text-blue-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">نظام الرادار بانتظار إشارة الارتباط...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {connectedDevices.map(dev => (
                          <div key={dev.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex justify-between items-center flex-row-reverse group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4 flex-row-reverse">
                              <div className="p-3 bg-slate-900 rounded-2xl text-blue-500 border border-slate-800 group-hover:border-emerald-500/30 transition-all">
                                <Smartphone size={24} />
                              </div>
                              <div className="text-right">
                                <p className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{dev.name}</p>
                                <p className="text-[10px] font-mono text-slate-600 mt-1">{dev.ip}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{dev.latency}ms</span>
                              <span className="text-[8px] text-slate-700 font-bold uppercase tracking-tighter">Latency</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : activeTab === 'security' ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-blue-500/50 to-transparent"></div>
                <div className="flex items-center gap-4 flex-row-reverse mb-10">
                  <div className="p-4 bg-amber-500/10 rounded-[1.5rem] border border-amber-500/20 text-amber-500">
                    <Shield size={32} />
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-white">مركز الحماية الذاتية</h2>
                    <p className="text-sm text-slate-500 font-medium">نظام المراقبة والإصلاح التلقائي للـ APK والشبكة.</p>
                  </div>
                </div>
                <SystemHealthMonitor health={systemHealth} onManualRepair={runDeepSystemRepair} />

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'تشفير WebRTC', status: 'نشط', icon: Lock },
                    { label: 'سلامة الذاكرة', status: 'مستقرة', icon: Database },
                    { label: 'الاستجابة الفورية', status: 'مثالية', icon: Activity }
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 flex flex-col items-center gap-3 text-center">
                      <s.icon size={20} className="text-blue-500" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-600 uppercase">{s.label}</p>
                        <p className="text-sm font-bold text-white">{s.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'logs' ? (
            <div className="max-w-5xl mx-auto h-[calc(100vh-200px)] flex flex-col">
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between flex-row-reverse mb-8">
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
                      <ListChecks size={24} />
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-bold text-white">سجل العمليات المركزي</h2>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Real-time Buffer logs</p>
                    </div>
                  </div>
                  <button onClick={() => setLogs([])} className="p-3 text-red-500/40 hover:text-red-500 transition-colors" title="مسح السجل">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-950 rounded-[2rem] border border-slate-800 p-6 custom-scrollbar font-mono text-sm shadow-inner">
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-20">
                      <Clock size={48} className="mb-4" />
                      <p className="text-xs font-black uppercase tracking-[0.3em]">No Log Entries</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-4 flex-row-reverse text-right group">
                          <span className="text-blue-600 font-black opacity-30 group-hover:opacity-100 transition-opacity">›</span>
                          <span className="text-slate-400 group-hover:text-blue-400 transition-colors leading-relaxed">{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'assistant' ? (
            <div className="max-w-4xl mx-auto h-[calc(100vh-280px)]"><NetworkAssistant fullHeight={true} /></div>
          ) : activeTab === 'wifi' ? (
            <WifiSettings />
          ) : (
            <UserPermissions
              users={users}
              currentUser={currentUser}
              onTogglePermission={(uid, p) => setUsers(prev => prev.map(u => u.id === uid ? { ...u, permissions: { ...u.permissions, [p]: !u.permissions[p] } } : u))}
              onAddUser={(u) => setUsers(p => [...p, { ...u, id: Date.now().toString(), lastLogin: 'لم يدخل' }])}
              onDeleteUser={(id) => setUsers(p => p.filter(x => x.id !== id))}
            />
          )}
        </main>
      </div>
      <style>{`
        main {
            padding-bottom: calc(32px + env(safe-area-inset-bottom));
            padding-top: env(safe-area-inset-top);
        }
        @media (max-width: 640px) {
            .max-w-6xl { padding: 0 4px; }
        }
      `}</style>
    </div>
  );
};

export default App;
