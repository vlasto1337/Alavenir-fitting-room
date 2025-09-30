import { GoogleGenAI, Modality } from "@google/genai";

// Ensure you have your API key set in your environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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
    
    const directive = "CRITICAL: Your output MUST be only the final image. Do NOT output any text, confirmation, or explanation. Your only response should be the image itself.";
    const photoRealismInstruction = "Your primary goal is to create an ultra-realistic, photorealistic image. It must look like a real photograph, not a render, illustration, or drawing.";

    let basePrompt: string;
    if (creativityLevel <= 20) {
        basePrompt = "Critically important: Do NOT change the person's face, features, body pose, or the background from the first image. Your ONLY task is to photorealistically redraw that person wearing the specified outfit. Preserve everything else from the original person's image.";
    } else if (creativityLevel <= 50) {
        basePrompt = "Preserve the person's face, features, and general body pose from the first image. Photorealistically redraw them in the specified outfit. You may make subtle adjustments to the background and lighting to better match the new clothing style.";
    } else if (creativityLevel <= 80) {
        basePrompt = "Photorealistically redraw the person from the first image in the specified outfit, keeping their facial identity. Feel free to adjust the body pose slightly for a more natural look and reinterpret the background to create a more cohesive and artistic scene that complements the outfit.";
    } else {
        basePrompt = "Create a new artistic, photorealistic image inspired by the first image, featuring the same person but in the specified outfit. Be highly creative with the pose, background, lighting, and overall style to produce a compelling fashion shot.";
    }

    let textPrompt: string;
    const negativePrompt = "Negative prompt: avoid cartoon, anime, illustration, 3d render, painting, drawing, sketches, unrealistic styles, text, letters, numbers, symbols, watermarks.";

    if (outfitImage) {
        parts.push({
            inlineData: {
                data: outfitImage.base64,
                mimeType: outfitImage.mimeType,
            },
        });
        const positiveInstruction = "Faithfully transfer all details, textures, and colors from the outfit in the second image. If the outfit has any text, logos, or patterns, they must be preserved exactly as they are. Do not add any new text or logos.";
        // For image references, we relax the negative prompt about text, as it should be preserved from the original.
        const imageNegativePrompt = "Negative prompt: avoid cartoon, anime, illustration, 3d render, painting, drawing, sketches, unrealistic styles, watermarks.";
        textPrompt = `${directive} ${photoRealismInstruction} ${basePrompt.replace('the specified outfit', 'the outfit from the second image.')} ${positiveInstruction} ${imageNegativePrompt}`;
    } else {
        textPrompt = `${directive} ${photoRealismInstruction} ${basePrompt.replace('the specified outfit', `this specific outfit: "${prompt}".`)} ${negativePrompt}`;
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
    
    const textResponse = response.text?.trim();
    if (textResponse) {
        // Check if the text response is the model just repeating instructions
        if (textResponse.toLowerCase().includes('i will generate') || textResponse.toLowerCase().includes('ultra-realistic')) {
             throw new Error(`Модель не смогла сгенерировать изображение и вернула текстовое описание своих действий. Попробуйте немного изменить запрос или настройки.`);
        }
        throw new Error(`Модель вернула текстовый ответ вместо изображения: "${textResponse}"`);
    }

    throw new Error("Изображение не было сгенерировано. Ответ модели не содержит данных изображения.");
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка API.";
    throw new Error(`Не удалось сгенерировать изображение. ${errorMessage}`);
  }
};