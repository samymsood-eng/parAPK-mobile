
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, ShieldCheck, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface ScannerModalProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // تنظيف أي نسخة سابقة للمستشعر
    const config = { 
      fps: 15, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);

    scannerRef.current.render(
      (decodedText) => {
        try {
          // التحقق من أن البيانات بتنسيق JSON الخاص بالمركز
          const parsed = JSON.parse(decodedText);
          if (parsed.app === "Republic-Smart-Center" || parsed.target) {
            onScan(decodedText);
            if (scannerRef.current) scannerRef.current.clear();
          } else {
            setErrorMsg("هذا الرمز لا يتبع بروتوكول مركز الجمهورية.");
          }
        } catch (e) {
          setErrorMsg("تنسيق الرمز غير مدعوم. تأكد من مسح رمز المركز.");
        }
      },
      (error) => {
        // خطأ قراءة بسيط (تجاهل)
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(30,64,175,0.2)] relative">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center flex-row-reverse bg-slate-900/50">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400 border border-blue-500/20">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">ماسح الكاميرا المتقدم</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Secure Handshake Protocol</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-full text-slate-500 transition-all active:scale-90"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 flex-row-reverse text-red-400 text-xs animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <span className="font-bold">{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="mr-auto text-[10px] underline">تجاهل</button>
            </div>
          )}

          <div className="relative rounded-[2rem] overflow-hidden bg-slate-950 min-h-[320px] border border-slate-800 shadow-inner group" id="qr-reader">
            {/* Visual Scanner Line Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 animate-[scan-line_3s_infinite_linear] pointer-events-none" />
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase">اتصال مشفر</span>
             </div>
             <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center gap-2">
                <Zap size={20} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase">ربط فوري</span>
             </div>
          </div>

          <p className="mt-6 text-slate-600 text-[11px] text-center font-bold flex items-center justify-center gap-2 flex-row-reverse">
            <RefreshCw size={12} className="animate-spin text-blue-600" />
            النظام بانتظار استجابة بصرية من جهاز الكمبيوتر...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        #qr-reader__dashboard { display: none !important; }
        #qr-reader__status_span { display: none !important; }
        #qr-reader video { width: 100% !important; border-radius: 2rem !important; }
      `}</style>
    </div>
  );
};

export default ScannerModal;
