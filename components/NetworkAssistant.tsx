
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { getNetworkingAdvice } from '../services/geminiService';
import { Message } from '../types';

interface NetworkAssistantProps {
  fullHeight?: boolean;
}

const NetworkAssistant: React.FC<NetworkAssistantProps> = ({ fullHeight = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "مرحباً بك في مركز الجمهورية الذكي. كيف يمكنني مساعدتك في ضبط الربط اليوم؟" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const response = await getNetworkingAdvice(messages, input);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className={`flex flex-col ${fullHeight ? 'h-full' : 'h-[500px]'} bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-right`}>
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-row-reverse bg-slate-800/30">
        <div className="flex items-center gap-3 flex-row-reverse">
          <Sparkles size={18} className="text-blue-500" />
          <span className="font-bold text-sm text-white">مساعد مركز الجمهورية</span>
        </div>
        <button onClick={() => setMessages([{ role: 'model', text: "تم تجديد الجلسة." }])} className="p-2 text-slate-500 hover:text-white">
          <RefreshCw size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-slate-500 text-center">جاري المعالجة...</div>}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2 flex-row-reverse">
          <input 
            type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="اكتب استفسارك هنا..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs outline-none focus:border-blue-500 text-right text-slate-200"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkAssistant;
