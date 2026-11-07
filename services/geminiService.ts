import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MODEL_NAME, FALLBACK_MODEL_NAME } from "../constants";

const STORAGE_KEY = 'gemini_api_key';

export const getActiveApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim()) return stored.trim();
  }
  const envKey = (process.env.API_KEY || '').trim();
  if (envKey && envKey !== 'PLACEHOLDER_API_KEY') {
    return envKey;
  }
  return '';
};

export const saveApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};

export const clearApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const convertArtistToStyle = async (artistName: string): Promise<string> => {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error("API Key Gemini belum diisi. Silakan masukkan dan simpan API Key Anda pada kolom di atas.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const executeGeneration = async (model: string): Promise<string> => {
    const response = await ai.models.generateContent({
      model,
      contents: `Artist: ${artistName}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 150,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Tidak ada respon teks yang diterima dari Gemini AI.");
    }
    return text.trim();
  };

  try {
    return await executeGeneration(MODEL_NAME);
  } catch (primaryError: any) {
    console.warn(`Gagal memanggil model ${MODEL_NAME}, mencoba fallback ke ${FALLBACK_MODEL_NAME}...`, primaryError);
    try {
      return await executeGeneration(FALLBACK_MODEL_NAME);
    } catch (fallbackError: any) {
      console.error("Gemini API Error:", fallbackError);
      const msg = fallbackError?.message || primaryError?.message || "Gagal memproses konversi gaya vokal.";
      throw new Error(`Gemini AI Error: ${msg}`);
    }
  }
};
