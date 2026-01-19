import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPrompts } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert TikTok Shop Creative Director specializing in "Google Flow Labs" style video generation.
Your goal is to analyze product images or videos and generate ultra-realistic, high-conversion video prompts.

Rules for Prompt Generation:
1.  **Structure**: Generate exactly 3 scenes.
    *   Scene 1 (00-08s): The Hook. Immediate visual engagement.
    *   Scene 2 (08-16s): Scarcity/Value. Showcasing features or limited availability.
    *   Scene 3 (16-24s): Call to Action (CTA). Strong visual cue to buy.
2.  **Style**:
    *   POV (Point of View) shot.
    *   Hands-only interaction (no faces unless absolutely necessary for the product type).
    *   Background: Professional soft-box lighting, clean studio, or relevant aesthetic context (e.g., kitchen for cookware), but keep it clean.
    *   **NO TEXT OVERLAYS** in the prompt description (the AI video generator adds text later).
    *   **NO ALUCINATIONS**: Only describe what is possible based on the product image.
3.  **Tone**: High-energy but premium.
4.  **Format**: Return strictly JSON.

Input: An image or video of a product.
Output: A JSON object containing the scenes.
`;

export const analyzeMediaWithGemini = async (
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<GeneratedPrompts> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const modelId = "gemini-2.5-flash-latest";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this product visual. Create a 3-scene TikTok Shop video generation prompt script (Hook, Scarcity, CTA) specifically for high-conversion marketing. Each scene is 8 seconds.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING, description: "Name of the identified product" },
            marketingAngle: { type: Type.STRING, description: "The core marketing hook used" },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, enum: ["Hook", "Scarcity", "CTA"] },
                  duration: { type: Type.STRING, description: "e.g., '00:00 - 00:08'" },
                  description: { type: Type.STRING, description: "Detailed visual prompt for the video generation model." },
                  cameraMovement: { type: Type.STRING, description: "Specific camera instructions (e.g., 'Slow push in', 'Handheld POV shake')" },
                  lighting: { type: Type.STRING, description: "Lighting instructions" },
                },
                required: ["phase", "duration", "description", "cameraMovement", "lighting"],
              },
            },
          },
          required: ["productName", "marketingAngle", "scenes"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as GeneratedPrompts;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
