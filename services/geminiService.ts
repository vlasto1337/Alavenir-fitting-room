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
  outfitImage: { base64: string; mimeType: string; } | undefined,
  creativityLevel: number
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
    
    let basePrompt: string;
    if (creativityLevel <= 20) {
        basePrompt = "Critically important: Do NOT change the person's face, features, body pose, or the background from the first image. Your task is ONLY to redraw that person wearing the specified outfit. Preserve everything else from the original person's image.";
    } else if (creativityLevel <= 50) {
        basePrompt = "Preserve the person's face, features, and general body pose from the first image. Redraw them in the specified outfit. You may make subtle adjustments to the background and lighting to better match the new clothing style.";
    } else if (creativityLevel <= 80) {
        basePrompt = "Redraw the person from the first image in the specified outfit, keeping their facial identity. Feel free to adjust the body pose slightly for a more natural look and reinterpret the background to create a more cohesive and artistic scene that complements the outfit.";
    } else {
        basePrompt = "Create a new artistic image inspired by the first image, featuring the same person but in the specified outfit. Be highly creative with the pose, background, lighting, and overall style to produce a compelling fashion shot.";
    }

    let textPrompt: string;

    if (outfitImage) {
        parts.push({
            inlineData: {
                data: outfitImage.base64,
                mimeType: outfitImage.mimeType,
            },
        });
        textPrompt = basePrompt.replace('the specified outfit', 'the outfit from the second image');
    } else {
        textPrompt = basePrompt.replace('the specified outfit', `this specific outfit: "${prompt}"`);
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