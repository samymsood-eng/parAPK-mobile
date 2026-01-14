
import React, { useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share, Zap, Wifi } from 'lucide-react';
import { ConnectionData } from '../types';

interface QRCodeDisplayProps {
  data: ConnectionData;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ data }) => {
  const qrValue = useMemo(() => {
    return JSON.stringify({
      app: "Republic-Smart-Center",
      target: `${data.ip}:${data.port}`
    });
  }, [data]);

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `republic-qr.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full mb-6 flex-row-reverse">
        <h3 className="text-sm font-bold text-slate-300">رمز الربط السريع</h3>
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <div className="px-3 py-1 bg-blue-600 rounded text-[9px] font-bold text-white flex items-center gap-1"><Zap size={10} /> Bridge</div>
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-xl mb-6 shadow-lg border border-slate-800">
        <QRCodeCanvas value={qrValue} size={200} level="M" />
      </div>

      <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-right mb-6">
        <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">توصيف المسار</p>
        <p className="text-xs font-mono text-blue-400">{data.ip}:{data.port}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button onClick={downloadQR} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-[10px] font-bold text-slate-300">
          <Download size={14} /> حفظ
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-[10px] font-bold text-white">
          <Share size={14} /> مشاركة
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
