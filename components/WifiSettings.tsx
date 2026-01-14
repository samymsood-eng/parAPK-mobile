
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Wifi, Search, Lock, ShieldCheck, RefreshCw, SignalHigh, SignalMedium, SignalLow, 
  Globe, WifiOff, Loader2, Check, EyeOff, Eye, ShieldAlert, History, Trash2, Zap,
  CircleDot, Fingerprint, Smartphone, Hash, Shield, Info, Settings2, RefreshCcw, Monitor as MonitorIcon,
  AlertTriangle, Server, Navigation, Activity, ChevronDown, ChevronUp
} from 'lucide-react';
import { WifiNetwork } from '../types';

interface SavedNetwork {
  ssid: string;
  password: string;
  lastConnected: string;
  encryption?: string;
}

type MacMode = 'random' | 'device' | 'static';
type IpMode = 'dhcp' | 'static';
type EncryptionType = 'WPA2' | 'WEP' | 'Open';

const WifiSettings: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [savedNetworks, setSavedNetworks] = useState<SavedNetwork[]>([]);
  const [connectedSsid, setConnectedSsid] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [encryption, setEncryption] = useState<EncryptionType>('WPA2');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // MAC Address Management States
  const [macMode, setMacMode] = useState<MacMode>('random');
  const [staticMac, setStaticMac] = useState('00:1A:2B:3C:4D:5E');
  const [generatedRandomMac, setGeneratedRandomMac] = useState('');

  // IP Configuration States
  const [ipMode, setIpMode] = useState<IpMode>('dhcp');
  const [staticIpConfig, setStaticIpConfig] = useState({
    address: '192.168.1.128',
    subnet: '255.255.255.0',
    gateway: '192.168.1.1',
    dns1: '8.8.8.8',
    dns2: '8.8.4.4'
  });

  // Generate a random MAC address
  const generateRandomMAC = useCallback(() => {
    const hexDigits = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 6; i++) {
      mac += hexDigits.charAt(Math.floor(Math.random() * 16));
      mac += hexDigits.charAt(Math.floor(Math.random() * 16));
      if (i < 5) mac += ":";
    }
    setGeneratedRandomMac(mac);
  }, []);

  useEffect(() => {
    generateRandomMAC();
  }, [generateRandomMAC]);

  // Active MAC display logic
  const activeMac = useMemo(() => {
    if (macMode === 'random') return generatedRandomMac;
    if (macMode === 'static') return staticMac;
    return 'D4:F5:27:8B:11:0A'; // Simulated Device MAC
  }, [macMode, generatedRandomMac, staticMac]);

  // تحميل الشبكات المحفوظة عند التشغيل
  useEffect(() => {
    const stored = localStorage.getItem('republic_known_networks');
    if (stored) {
      try {
        setSavedNetworks(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading saved networks", e);
      }
    }
  }, []);

  // حساب قوة كلمة المرور
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-800' };
    let score = 0;
    if (password.length > 5) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (password.length > 8 && /[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1: return { score: 1, label: 'ضعيفة', color: 'bg-red-500' };
      case 2: return { score: 2, label: 'متوسطة', color: 'bg-amber-500' };
      case 3: return { score: 3, label: 'قوية جداً', color: 'bg-emerald-500' };
      default: return { score: 0, label: 'قصيرة جداً', color: 'bg-red-400' };
    }
  }, [password]);

  const simulateScan = () => {
    setIsScanning(true);
    setNetworks([]);
    setTimeout(() => {
      const dummyNetworks: WifiNetwork[] = [
        { id: '1', ssid: 'Republic_Office_5G', strength: 'strong', isSecure: true },
        { id: '2', ssid: 'Guest_Network', strength: 'medium', isSecure: true },
        { id: '3', ssid: 'Smart_Core_Hub', strength: 'strong', isSecure: true },
        { id: '4', ssid: 'Public_WiFi_Free', strength: 'weak', isSecure: false },
      ];
      setNetworks(dummyNetworks);
      setIsScanning(false);
    }, 2000);
  };

  const handleConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ssid) return;
    if (encryption !== 'Open' && !password) return;

    setIsConnecting(true);
    setConnectionSuccess(false);
    
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionSuccess(true);
      setConnectedSsid(ssid);
      
      const newSaved = [...savedNetworks.filter(n => n.ssid !== ssid)];
      newSaved.unshift({
        ssid,
        password,
        encryption,
        lastConnected: new Date().toLocaleString('ar-EG')
      });
      const limitedSaved = newSaved.slice(0, 5);
      setSavedNetworks(limitedSaved);
      localStorage.setItem('republic_known_networks', JSON.stringify(limitedSaved));

      setTimeout(() => setConnectionSuccess(false), 3000);
    }, 2500);
  };

  const selectNet = (net: WifiNetwork) => {
    setSelectedNetwork(net.id);
    setSsid(net.ssid);
    setIsManualEntry(false);
    setEncryption(net.isSecure ? 'WPA2' : 'Open');
    
    const saved = savedNetworks.find(n => n.ssid === net.ssid);
    if (saved) {
      setPassword(saved.password);
    } else {
      setPassword('');
    }
  };

  const selectSaved = (net: SavedNetwork) => {
    setSsid(net.ssid);
    setPassword(net.password);
    setEncryption((net.encryption as EncryptionType) || 'WPA2');
    setIsManualEntry(false);
    setSelectedNetwork(null);
  };

  const removeSaved = (ssidToRemove: string) => {
    const updated = savedNetworks.filter(n => n.ssid !== ssidToRemove);
    setSavedNetworks(updated);
    if (connectedSsid === ssidToRemove) setConnectedSsid(null);
    localStorage.setItem('republic_known_networks', JSON.stringify(updated));
  };

  const renderStatusIndicator = (networkSsid: string, strength?: WifiNetwork['strength']) => {
    const isConnected = connectedSsid === networkSsid;
    const isSaved = savedNetworks.some(n => n.ssid === networkSsid);

    if (isConnected) {
      return (
        <div className="flex items-center gap-2">
          {strength === 'weak' && (
            <div className="flex items-center gap-1 text-amber-500 animate-pulse" title="إشارة ضعيفة قد تؤثر على الاستقرار">
              <AlertTriangle size={10} />
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-md text-emerald-400">
            <CircleDot size={10} className="animate-pulse" />
            <span className="text-[8px] font-black uppercase">متصل</span>
          </div>
        </div>
      );
    }

    if (isSaved) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400">
          <Zap size={10} />
          <span className="text-[8px] font-black uppercase">محفوظة</span>
        </div>
      );
    }

    return (
      <span className="text-[8px] font-bold text-slate-700 uppercase tracking-tighter mr-2">متوفرة</span>
    );
  };

  const renderSignalIndicator = (strength: WifiNetwork['strength']) => {
    const levels = {
      strong: { icon: SignalHigh, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'قوي' },
      medium: { icon: SignalMedium, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'متوسط' },
      weak: { icon: SignalLow, color: 'text-red-500', bg: 'bg-red-500/10', label: 'ضعيف' }
    };

    const { icon: Icon, color, bg, label } = levels[strength];

    return (
      <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${bg} border border-${color.split('-')[1]}-500/10 transition-all group-hover:scale-105`}>
        <span className={`text-[8px] font-black uppercase tracking-tighter ${color}`}>{label}</span>
        <Icon size={14} className={color} />
      </div>
    );
  };

  const isCurrentConnectionWeak = useMemo(() => {
    if (!connectedSsid) return false;
    const activeNet = networks.find(n => n.ssid === connectedSsid);
    return activeNet?.strength === 'weak';
  }, [connectedSsid, networks]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right font-['Noto Kufi Arabic'] pb-10">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between flex-row-reverse relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />
        <div className="flex items-center gap-4 flex-row-reverse relative z-10">
          <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500 border border-blue-500/20 shadow-inner">
            <Wifi size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">إدارة الشبكة اللاسلكية</h2>
            <p className="text-sm text-slate-500 font-medium">التحكم في اتصالات الواي فاي وإدارة الشبكات المعروفة للمركز.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
           <button 
            onClick={() => {
              setIsManualEntry(true);
              setSelectedNetwork(null);
              setSsid('');
              setPassword('');
              setEncryption('WPA2');
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${isManualEntry ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            <EyeOff size={16} />
            <span>إضافة شبكة مخفية</span>
          </button>
          <button 
            onClick={simulateScan}
            disabled={isScanning}
            className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:cursor-not-allowed disabled:opacity-70 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95 min-w-[180px] justify-center"
          >
            {isScanning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>جاري البحث...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>بحث عن شبكات</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Networks & Saved */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-7 rounded-[2.5rem] flex flex-col h-[480px] shadow-lg">
            <h3 className="text-xs font-black text-slate-500 uppercase mb-5 flex items-center gap-3 flex-row-reverse border-r-4 border-blue-600 pr-3">
              <Globe size={18} className="text-blue-500" /> الشبكات المتوفرة حالياً
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
              {isScanning ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                  <div className="relative">
                    <Loader2 size={40} className="animate-spin text-blue-500" />
                    <Wifi size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase">جاري مسح الترددات...</p>
                </div>
              ) : (
                <>
                  {networks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 space-y-6 animate-in fade-in duration-700">
                      <div className="relative">
                        <WifiOff size={64} strokeWidth={1} className="opacity-20" />
                        <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
                      </div>
                      <div className="text-center space-y-4">
                        <p className="text-xs font-bold opacity-40">لم يتم اكتشاف أي ترددات قريبة</p>
                        <button 
                          onClick={simulateScan}
                          disabled={isScanning}
                          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 rounded-2xl text-[10px] font-black uppercase text-blue-400 transition-all flex items-center gap-3 mx-auto shadow-lg shadow-black/20 active:scale-95 group"
                        >
                          {isScanning ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />}
                          <span>بدء مسح النطاق</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    networks.map(net => (
                      <button 
                        key={net.id}
                        onClick={() => selectNet(net)}
                        className={`w-full p-4 rounded-2xl border flex justify-between items-center flex-row-reverse transition-all duration-300 group ${selectedNetwork === net.id && !isManualEntry ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-950/20' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'}`}
                      >
                        <div className="flex items-center gap-4 flex-row-reverse">
                          <div className={`p-2 rounded-lg transition-colors ${net.isSecure ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-emerald-500/10'}`}>
                            {net.isSecure ? <Lock size={14} className="text-slate-500" /> : <Globe size={14} className="text-emerald-500" />}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 flex-row-reverse">
                              <span className="text-sm font-bold text-slate-200">{net.ssid}</span>
                              {renderStatusIndicator(net.ssid, net.strength)}
                            </div>
                          </div>
                        </div>
                        {renderSignalIndicator(net.strength)}
                      </button>
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Saved Networks */}
          {savedNetworks.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-7 rounded-[2.5rem] shadow-lg">
              <h3 className="text-xs font-black text-slate-500 uppercase mb-5 flex items-center gap-3 flex-row-reverse border-r-4 border-emerald-500 pr-3">
                <History size={18} className="text-emerald-500" /> تاريخ الاتصالات المحفوظة
              </h3>
              <div className="space-y-3">
                {savedNetworks.map((net, i) => (
                  <div key={i} className="flex items-center gap-2 flex-row-reverse">
                    <button 
                      onClick={() => selectSaved(net)}
                      className={`flex-1 bg-slate-950/60 border p-4 rounded-2xl flex justify-between items-center flex-row-reverse hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group ${connectedSsid === net.ssid ? 'border-emerald-500/30 ring-1 ring-emerald-500/20' : 'border-slate-800'}`}
                    >
                      <div className="flex items-center gap-3 flex-row-reverse">
                        <div className={`p-2 rounded-xl transition-colors ${connectedSsid === net.ssid ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500 group-hover:text-emerald-400'}`}>
                          {connectedSsid === net.ssid ? <CircleDot size={14} className="animate-pulse" /> : <Zap size={14} />}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{net.ssid}</p>
                            {connectedSsid === net.ssid && <span className="text-[7px] bg-emerald-500 text-white px-1 rounded uppercase font-black">Online</span>}
                          </div>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">{net.lastConnected}</p>
                        </div>
                      </div>
                      <Check size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button 
                      onClick={() => removeSaved(net.ssid)}
                      className="p-3 bg-red-500/5 border border-red-500/10 text-red-900/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Connection Form, IP Config & MAC Management */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="flex justify-between items-center flex-row-reverse mb-10">
               <h3 className="text-xs font-black text-slate-500 uppercase flex items-center gap-3 flex-row-reverse border-r-4 border-slate-800 pr-3">
                <ShieldCheck size={20} className="text-slate-600" /> معايير الاتصال والتحقق
              </h3>
              {isManualEntry && (
                <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <ShieldAlert size={14} />
                  <span className="text-[10px] font-bold uppercase">وضع الإدخال اليدوي</span>
                </div>
              )}
            </div>

            {/* Subtle Weak Signal Notification */}
            {isCurrentConnectionWeak && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between flex-row-reverse animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <AlertTriangle size={20} className="text-amber-500" />
                  <div className="text-right">
                    <p className="text-[11px] font-black text-amber-500 uppercase">جودة الإشارة منخفضة</p>
                    <p className="text-[9px] text-slate-400 font-bold">قد تواجه بطءاً في نقل البيانات أو عدم استقرار في الاتصال حالياً.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleConnect} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block pr-1">
                  {isManualEntry ? 'معرف الشبكة المخفية (SSID)' : 'معرف الشبكة المختار (SSID)'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Wifi size={18} className={`${isManualEntry ? 'text-amber-500' : 'text-slate-600'} group-focus-within:text-blue-500 transition-colors`} />
                  </div>
                  <input 
                    type="text"
                    value={ssid}
                    readOnly={!isManualEntry && networks.length > 0}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder={isManualEntry ? "أدخل اسم الشبكة المخفية هنا..." : "اختر شبكة من القائمة الجانبية..."}
                    className={`w-full bg-slate-950 border rounded-[1.2rem] py-4 pr-12 pl-5 text-white text-right text-sm outline-none transition-all duration-300 shadow-inner ${isManualEntry ? 'border-amber-500/30 ring-4 ring-amber-500/5 focus:border-amber-500' : 'border-slate-800 focus:border-blue-500'}`}
                  />
                </div>
              </div>

              {encryption !== 'Open' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block pr-1">مفتاح الحماية (Password)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Lock size={18} className="text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-[1.2rem] py-4 pr-12 pl-12 text-white text-right text-sm outline-none focus:border-blue-500 transition-all shadow-inner font-mono tracking-[0.3em]"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-600 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="mt-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/50 space-y-3">
                      <div className="flex justify-between items-center flex-row-reverse px-1">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">مستوى التشفير المتوقع</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border transition-colors ${passwordStrength.color.replace('bg-', 'text-')} ${passwordStrength.color.replace('bg-', 'border-').replace('500', '500/30')}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="flex gap-2 h-1.5">
                        {[1, 2, 3].map((step) => (
                          <div 
                            key={step} 
                            className={`flex-1 rounded-full transition-all duration-700 ${step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-800 shadow-inner'}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced IP Configuration Section */}
              <div className="space-y-6 pt-6 border-t border-slate-800/50">
                <button 
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full flex-row-reverse group px-1"
                >
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Settings2 size={18} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">إعدادات الشبكة المتقدمة</span>
                  </div>
                  {showAdvanced ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-600" />}
                </button>

                {showAdvanced && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between flex-row-reverse bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 mr-3">نوع تكوين العنوان</span>
                      <div className="flex gap-1">
                        <button 
                          type="button"
                          onClick={() => setIpMode('dhcp')}
                          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${ipMode === 'dhcp' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                          DHCP (تلقائي)
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIpMode('static')}
                          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${ipMode === 'static' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                          Static (يدوي)
                        </button>
                      </div>
                    </div>

                    {ipMode === 'static' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase mr-1">عنوان IP الخاص بالجهاز</label>
                          <div className="relative group">
                            <Server size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                              type="text"
                              value={staticIpConfig.address}
                              onChange={(e) => setStaticIpConfig({...staticIpConfig, address: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-9 pl-3 text-xs text-white outline-none focus:border-amber-500 font-mono tracking-wider transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase mr-1">قناع الشبكة (Subnet Mask)</label>
                          <div className="relative group">
                            <Activity size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                              type="text"
                              value={staticIpConfig.subnet}
                              onChange={(e) => setStaticIpConfig({...staticIpConfig, subnet: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-9 pl-3 text-xs text-white outline-none focus:border-amber-500 font-mono tracking-wider transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase mr-1">البوابة (Gateway / Router)</label>
                          <div className="relative group">
                            <Navigation size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                              type="text"
                              value={staticIpConfig.gateway}
                              onChange={(e) => setStaticIpConfig({...staticIpConfig, gateway: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-9 pl-3 text-xs text-white outline-none focus:border-amber-500 font-mono tracking-wider transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase mr-1">خادم DNS الأساسي</label>
                          <div className="relative group">
                            <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                              type="text"
                              value={staticIpConfig.dns1}
                              onChange={(e) => setStaticIpConfig({...staticIpConfig, dns1: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-9 pl-3 text-xs text-white outline-none focus:border-amber-500 font-mono tracking-wider transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[9px] font-bold text-slate-600 uppercase mr-1">خادم DNS الثانوي (اختياري)</label>
                          <div className="relative group">
                            <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                              type="text"
                              value={staticIpConfig.dns2}
                              onChange={(e) => setStaticIpConfig({...staticIpConfig, dns2: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-9 pl-3 text-xs text-white outline-none focus:border-amber-500 font-mono tracking-wider transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isConnecting || !ssid}
                className={`w-full py-5 rounded-[1.5rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-500 ${connectionSuccess ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-900/30 active:scale-[0.98]'} disabled:opacity-40`}
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>جاري التحقق من الشبكة...</span>
                  </>
                ) : connectionSuccess ? (
                  <>
                    <div className="bg-white/20 p-1 rounded-full"><Check size={20} /></div>
                    <span>تم تأسيس الارتباط</span>
                  </>
                ) : (
                  <>
                    <Zap size={22} className="fill-current" />
                    <span>تأسيس الارتباط</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Enhanced MAC Management Section */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] -ml-10 -mb-10 pointer-events-none" />
             
             <div className="flex justify-between items-center flex-row-reverse mb-8">
               <h3 className="text-xs font-black text-slate-500 uppercase flex items-center gap-3 flex-row-reverse border-r-4 border-emerald-500 pr-3">
                 <Fingerprint size={20} className="text-emerald-500" /> إدارة الهوية الفيزيائية والتمويه (MAC)
               </h3>
               <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <MonitorIcon size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-mono text-emerald-400 tracking-wider">{activeMac}</span>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'random' as MacMode, label: 'MAC عشوائي', icon: Shield, desc: 'تمويه هوية نشط' },
                  { id: 'device' as MacMode, label: 'MAC الجهاز', icon: Smartphone, desc: 'الهوية الحقيقية' },
                  { id: 'static' as MacMode, label: 'MAC ثابت', icon: Hash, desc: 'تعيين يدوي مخصص' }
                ].map((mode) => (
                  <button 
                    key={mode.id}
                    onClick={() => setMacMode(mode.id)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      macMode === mode.id 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 ring-2 ring-emerald-500/10' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {macMode === mode.id && <div className="absolute top-0 right-0 p-1"><Check size={10} /></div>}
                    
                    {/* Tooltip for Device MAC */}
                    {mode.id === 'device' && (
                      <div className="absolute top-2 left-2 group/info">
                        <Info size={12} className="text-slate-600 cursor-help hover:text-blue-400 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-800 text-[8px] text-slate-200 rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none border border-slate-700 shadow-2xl z-50 text-center leading-relaxed">
                          هذا هو العنوان الفعلي الدائم لجهازك. استخدمه للاتصال بالشبكات التي تعتمد على "القوائم البيضاء" للأجهزة المعروفة.
                        </div>
                      </div>
                    )}
                    
                    <mode.icon size={22} className={macMode === mode.id ? 'text-emerald-400' : 'text-slate-700'} />
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-wider mb-0.5">{mode.label}</p>
                      <p className="text-[8px] font-medium opacity-60 leading-tight">{mode.desc}</p>
                    </div>
                  </button>
                ))}
             </div>

             {macMode === 'static' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Hash size={18} className="text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input 
                      type="text"
                      value={staticMac}
                      onChange={(e) => setStaticMac(e.target.value.toUpperCase().slice(0, 17))}
                      placeholder="00:00:00:00:00:00"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pr-12 pl-5 text-white text-right text-xs outline-none focus:border-emerald-500 transition-all font-mono tracking-widest shadow-inner"
                    />
                  </div>
                  <p className="text-[9px] text-slate-600 font-bold mt-3 mr-1 flex items-center gap-2 flex-row-reverse leading-relaxed">
                    <Info size={12} className="text-slate-700 shrink-0" />
                    استخدم هذا الخيار لتخطي قيود الربط في الشبكات التي تتطلب عناوين مسجلة.
                  </p>
                </div>
             )}

             {macMode === 'random' && (
               <div className="animate-in fade-in duration-500">
                 <div className="flex items-center justify-between flex-row-reverse bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl mb-4">
                   <div className="flex items-center gap-3 flex-row-reverse">
                    <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                    <div className="text-right">
                      <p className="text-[10px] text-emerald-400 font-black uppercase mb-0.5">وضع التمويه النشط</p>
                      <p className="text-[9px] text-emerald-600 font-bold">يتم توليد عنوان فريد لكل ارتباط.</p>
                    </div>
                   </div>
                   <button 
                    onClick={generateRandomMAC}
                    className="p-3 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold"
                    title="توليد عنوان جديد فوراً"
                   >
                     <RefreshCcw size={16} />
                     <span>تجديد</span>
                   </button>
                 </div>
               </div>
             )}

             {macMode === 'device' && (
               <div className="flex items-center gap-3 flex-row-reverse bg-slate-950/60 border border-slate-800 p-5 rounded-2xl animate-in fade-in duration-500">
                 <Smartphone size={20} className="text-slate-600 shrink-0" />
                 <div className="text-right">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">استخدام الهوية الأصلية</p>
                   <p className="text-[9px] text-slate-600 font-bold leading-relaxed">العنوان الفيزيائي الحقيقي لبطاقة الشبكة في جهازك الحالي.</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-slate-700 pt-10">
        <ShieldCheck size={14} className="opacity-30" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Republic Integrated Secure Network Protocol v4.0</p>
      </div>
    </div>
  );
};

export default WifiSettings;
