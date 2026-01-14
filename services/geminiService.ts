
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNetworkingAdvice = async (history: Message[], currentPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: currentPrompt }] }
      ],
      config: {
        systemInstruction: `أنت المساعد الذكي لنظام "مركز الجمهورية الذكي". 
        مهمتك هي تقديم الدعم الفني والإرشادات لربط الأجهزة الجوالة ببرامج الكمبيوتر عبر الشبكة المحلية (WiFi/WebRTC).
        
        ركز على:
        1. تقديم حلول لربط الأجهزة باستخدام نظام مركز الجمهورية الذكي.
        2. شرح إعدادات الـ IP والمنافذ (Ports) بوضوح.
        3. مساعدة المستخدم في استكشاف أخطاء الاتصال وإصلاحها.
        4. التعامل مع المستخدم بأسلوب احترافي يعكس جودة نظام مركز الجمهورية.
        
        اجعل ردودك دائماً تقنية دقيقة وباللغة العربية الفصحى أو بلهجة مصرية تقنية مهذبة.`
      }
    });

    return response.text || "عذراً، تعذر الاتصال حالياً. حاول مجدداً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "فشل الاتصال بمساعد المركز. يرجى التحقق من اتصال الإنترنت.";
  }
};
