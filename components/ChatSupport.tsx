
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { GoogleGenAI } from "@google/genai";
import { t } from '../translations';

const ChatSupport: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'AR';
  const labels = t[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: labels.howCanIHelp }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `You are a professional support assistant for AQTAR GeoMarket, a geospatial intelligence platform for Saudi Arabia. 
          The user is asking about platform features, market data, or how to use the site. 
          Be helpful, concise, and professional. 
          If they ask about specific data, refer to the Heatmap and AI Intelligence sections.
          Language: ${lang === 'AR' ? 'Arabic' : 'English'}.`,
          temperature: 0.7,
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Support is currently unavailable. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-50`}>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#00F5D4] text-[#0A2342] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(0,245,212,0.4)] hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute bottom-20 ${isRtl ? 'left-0' : 'right-0'} w-80 md:w-96 h-[500px] bg-[#1B263B] border border-slate-700 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500`}>
          <div className="bg-[#0A2342] p-6 border-b border-slate-800 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#00F5D4] flex items-center justify-center text-xl">🤖</div>
             <div>
                <h4 className={`text-white text-sm font-black uppercase tracking-widest ${isRtl ? 'arabic-font' : ''}`}>{labels.chatSupport}</h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] text-slate-500 font-black uppercase">AI_ONLINE</span>
                </div>
             </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-[#005F73] text-white' : 'bg-slate-900 text-slate-300'} ${isRtl ? 'arabic-font' : ''}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1.5 p-2 bg-slate-900 rounded-xl w-16 self-start animate-pulse">
                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={labels.chatWithAI}
              className={`flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F5D4] transition-all ${isRtl ? 'text-right arabic-font' : ''}`}
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-[#00F5D4] text-[#0A2342] rounded-xl hover:scale-105 active:scale-95 transition shadow-lg"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
