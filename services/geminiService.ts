
import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_MODEL = 'gemini-2.5-flash';

const apiKey = import.meta.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY ist nicht gesetzt. AI-Funktionen werden nicht funktionieren.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const geminiService = {
  async reviewBlogPost(content: string) {
    if (!ai) {
      throw new Error('GEMINI_API_KEY ist nicht konfiguriert. Bitte setzen Sie die Umgebungsvariable GEMINI_API_KEY in der .env.local Datei.');
    }
    
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Review this blog post for the "Europe Blog" of a youth organization. Ensure it is respectful, factually sound about Europe, and provides constructive feedback.
        
        Content: ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              approved: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              suggestedTitle: { type: Type.STRING }
            },
            required: ["approved", "feedback"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error('Fehler beim Review des Blog-Posts:', error);
      throw error;
    }
  },

  async generateQuizQuestion() {
    if (!ai) {
      throw new Error('GEMINI_API_KEY ist nicht konfiguriert. Bitte setzen Sie die Umgebungsvariable GEMINI_API_KEY in der .env.local Datei.');
    }
    
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: "Generiere eine Quizfrage über die Europäische Union (Geschichte, Institutionen, Kultur) auf Deutsch.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error('Fehler beim Generieren der Quiz-Frage:', error);
      throw error;
    }
  }
};
