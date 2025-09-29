import { GoogleGenAI, Modality } from "@google/genai";

// Ensure you have your API key set in your environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const generateStyledImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  outfitImage?: { base64: string; mimeType: string; }
): Promise<string> => {
  if (!base64ImageData || !mimeType) {
    throw new Error("Отсутствует изображение человека для генерации.");
  }
  if (!outfitImage && !prompt.trim()) {
     throw new Error("Отсутствует описание или изображение одежды.");
  }
  
  try {
    const parts: any[] = [
      {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      },
    ];
    
    let textPrompt: string;

    if (outfitImage) {
        parts.push({
            inlineData: {
                data: outfitImage.base64,
                mimeType: outfitImage.mimeType,
            },
        });
        textPrompt = `Given the first image of a person and the second image of an outfit, please redraw the person from the first image wearing the outfit from the second image. Maintain the person's face, features, and the background as much as possible, focusing only on changing the clothing.`;
    } else {
        textPrompt = `Given the user photo, please redraw the person wearing the following outfit: ${prompt}. Maintain the person's face, features, and the background as much as possible, focusing only on changing the clothing.`;
    }

    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
    
    // Check for text-only response as a fallback for error diagnosis
    const textResponse = response.text;
    if (textResponse) {
        throw new Error(`Модель вернула текстовый ответ вместо изображения: "${textResponse}"`);
    }

    throw new Error("Изображение не было сгенерировано. Ответ модели не содержит данных изображения.");
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка API.";
    throw new Error(`Не удалось сгенерировать изображение. ${errorMessage}`);
  }
};