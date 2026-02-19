
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getMarketIntelligence = async (topic: string, lang: 'AR' | 'EN', history: any[] = []) => {
  const ai = getAI();
  
  const systemInstruction = `Act as a senior Geospatial Strategy Consultant for the Saudi Arabian market. 
  Topic: ${topic}. 
  Your goal is to provide high-level strategic intelligence for decision-makers (CEOs, Project Managers at NEOM, RSG, etc.).
  
  Provide a detailed executive analysis covering:
  - Technical Feasibility: Align with GASGI (General Authority for Survey and Geospatial Information) technical standards.
  - Strategic Demand: Connect the query to Vision 2030 giga-projects (The Line, Diriyah, Qiddiya).
  - Supply Intelligence: Analyze lead times and availability of specific sensor types in the local KSA market.
  - ROI Assessment: Briefly touch upon the cost-benefit of using high-end vs entry-level hardware for the specific use-case.
  
  Tone: Professional, authoritative, and data-driven.
  Language: ${lang === 'AR' ? 'Arabic (professional/formal)' : 'English'}.
  Respond in structured Markdown. Use grounding to find actual recent news about the Saudi geospatial sector.`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.4, // Reduced for more factual/consultant tone
      },
      history: history.length > 0 ? history : undefined
    });

    const response = await chat.sendMessage({ message: topic });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Consultant AI Error:", error);
    return { text: "Analysis engine failed to initialize. Please check connectivity.", sources: [] };
  }
};

export const generateMarketReportSummary = async (data: any) => {
    const ai = getAI();
    const prompt = `Perform a high-level executive summarization of this geospatial data for a Board of Directors report. Focus on market risks and opportunities: ${JSON.stringify(data)}`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text;
};
