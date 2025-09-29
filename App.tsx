import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';
import { SparklesIcon, LogoIcon, ChevronDownIcon } from './components/icons';
import { Faq } from './components/Faq';

const PROMPT_PRESETS = [
  'классический тренч поверх белой рубашки',
  'уютный оверсайз-худи и черные карго-штаны',
  'элегантный образ с блейзером и темными джинсами',
  'футуристическая куртка в стиле киберпанк',
  'богемный стиль с летящей узорчатой рубашкой',
  'спортивный костюм в ярких неоновых цветах',
];

const App: React.FC = () => {
  // Person image state
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);

  // Outfit input state
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState<string>('');
  const [outfitImageFile, setOutfitImageFile] = useState<File | null>(null);
  const [outfitImagePreview, setOutfitImagePreview] = useState<string | null>(null);
  
  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [creativityLevel, setCreativityLevel] = useState<number>(25);

  // Result state
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setGeneratedImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match || arr.length < 2) return null;
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  const handleOutfitImageUpload = async (file: File) => {
    if (!originalImagePreview) {
      setError("Пожалуйста, сначала загрузите ваше фото.");
      return;
    }

    setOutfitImageFile(null);
    setOutfitImagePreview(null);
    setError(null);
    setGeneratedImage(null);

    try {
      const userImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error('Не удалось загрузить фото пользователя для определения размеров.'));
        img.src = originalImagePreview;
      });

      const outfitImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(new Error('Не удалось загрузить фото одежды.'));
          const objectURL = URL.createObjectURL(file);
          img.src = objectURL;
      });
      

      const targetWidth = userImg.naturalWidth;
      const targetHeight = userImg.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Не удалось получить контекст canvas для обработки изображения.');

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const ratio = Math.min(targetWidth / outfitImg.width, targetHeight / outfitImg.height);
      const newWidth = outfitImg.width * ratio;
      const newHeight = outfitImg.height * ratio;
      const x = (targetWidth - newWidth) / 2;
      const y = (targetHeight - newHeight) / 2;
      
      ctx.drawImage(outfitImg, x, y, newWidth, newHeight);

      const dataUrl = canvas.toDataURL('image/jpeg');
      const newFile = dataURLtoFile(dataUrl, file.name);

      if (!newFile) {
        throw new Error('Не удалось преобразовать обработанное изображение в файл.');
      }

      setOutfitImageFile(newFile);
      setOutfitImagePreview(dataUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка при обработке изображения одежды.");
    }
  };
  
  const handleModeChange = (mode: 'text' | 'image') => {
    if (mode === 'text') {
        setOutfitImageFile(null);
        setOutfitImagePreview(null);
    } else {
        setPrompt('');
    }
    setInputMode(mode);
    setError(null);
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const convertToPng = (jpegBase64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for PNG conversion.'));
      };
      img.src = `data:image/jpeg;base64,${jpegBase64}`;
    });
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImageFile) {
        setError('Пожалуйста, загрузите ваше фото.');
        return;
    }
    if (inputMode === 'text' && !prompt.trim()) {
        setError('Пожалуйста, опишите наряд.');
        return;
    }
    if (inputMode === 'image' && !outfitImageFile) {
        setError('Пожалуйста, загрузите изображение наряда.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await fileToBase64(originalImageFile);
      let outfitImageDetails;

      if (inputMode === 'image' && outfitImageFile) {
        const outfitBase64 = await fileToBase64(outfitImageFile);
        outfitImageDetails = {
          base64: outfitBase64,
          mimeType: outfitImageFile.type,
        };
      }
      
      const newImageBase64 = await generateStyledImage(
        base64Image,
        originalImageFile.type,
        prompt,
        outfitImageDetails,
        creativityLevel,
      );
      
      const pngDataUrl = await convertToPng(newImageBase64);
      setGeneratedImage(pngDataUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt, inputMode, outfitImageFile, creativityLevel]);
  
  const handleContinueStyling = useCallback(() => {
    if (!generatedImage) return;

    const newImageFile = dataURLtoFile(generatedImage, `styled-image-${Date.now()}.png`);
    if (newImageFile) {
        handleImageUpload(newImageFile);

        // Reset inputs and results for the next step
        setPrompt('');
        setOutfitImageFile(null);
        setOutfitImagePreview(null);
        setGeneratedImage(null);
        setError(null);
        
        // Scroll to the top of the controls for better UX
        const controlsElement = document.getElementById('controls');
        controlsElement?.scrollIntoView({ behavior: 'smooth' });

    } else {
        setError("Не удалось использовать сгенерированное изображение. Пожалуйста, попробуйте сохранить его и загрузить вручную.");
    }
  }, [generatedImage]);

  const canGenerate = originalImageFile && (inputMode === 'text' ? prompt.trim().length > 0 : !!outfitImageFile) && !isLoading;
  
  return (
    <div className="min-h-screen bg-black text-zinc-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
            <LogoIcon className="text-violet-500"/>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">
             Цифровая примерочная
            </h1>
        </div>
        <p className="text-md text-zinc-400">
          Загрузите свое фото, опишите новый образ и увидите магию в действии.
        </p>
      </header>

      <main className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div id="controls" className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-zinc-800 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-zinc-100 border-b border-zinc-800 pb-4">1. Настройка</h2>
            <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={originalImagePreview} label="Загрузите ваше фото:" />
            
            <div className="flex flex-col gap-4">
              <label className="block text-sm font-medium text-zinc-300">Опишите или загрузите одежду:</label>
              <div className="flex border-b border-zinc-700">
                  <button onClick={() => handleModeChange('text')} className={`py-2 px-4 transition-colors text-sm font-medium ${inputMode === 'text' ? 'text-white border-b-2 border-violet-500' : 'text-zinc-400 hover:text-white focus:outline-none'}`}>
                      Описать
                  </button>
                  <button onClick={() => handleModeChange('image')} className={`py-2 px-4 transition-colors text-sm font-medium ${inputMode === 'image' ? 'text-white border-b-2 border-violet-500' : 'text-zinc-400 hover:text-white focus:outline-none'}`}>
                      Загрузить фото
                  </button>
              </div>

              {inputMode === 'text' ? (
                   <div>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="например, 'черная кожаная куртка поверх белой футболки'"
                        className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors placeholder-zinc-500"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                        {PROMPT_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setPrompt(preset)}
                                className="px-3 py-1 text-xs font-medium bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                   </div>
              ) : (
                  originalImagePreview ? (
                      <ImageUploader
                          onImageUpload={handleOutfitImageUpload}
                          imagePreviewUrl={outfitImagePreview}
                          label="Загрузите фото одежды:"
                      />
                  ) : (
                      <div className="flex items-center justify-center w-full h-64 border-2 border-dashed border-zinc-700 rounded-lg bg-zinc-900/50 p-4">
                          <div className="text-center text-zinc-500">
                              <p className="font-medium">Пожалуйста, сначала загрузите ваше фото</p>
                              <p className="text-sm">в разделе выше, чтобы активировать эту опцию.</p>
                          </div>
                      </div>
                  )
              )}
            </div>
            
            <div className="mt-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1 w-full"
                aria-expanded={showAdvanced}
              >
                Расширенные настройки
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
              {showAdvanced && (
                <div className="mt-3 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 animate-fade-in">
                  <label htmlFor="creativity" className="block text-sm font-medium text-zinc-300">
                    Уровень креативности: <span className="font-bold text-violet-400 tabular-nums">{creativityLevel}</span>
                  </label>
                  <p className="text-xs text-zinc-500 mb-3">
                    Более высокие значения позволяют ИИ сильнее изменять фон и позу.
                  </p>
                  <input
                    id="creativity"
                    type="range"
                    min="0"
                    max="100"
                    value={creativityLevel}
                    onChange={(e) => setCreativityLevel(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={!canGenerate}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 ease-in-out
                ${canGenerate
                  ? 'bg-violet-600 hover:bg-violet-700 transform hover:-translate-y-px glowing-button'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
            >
              <SparklesIcon className="w-5 h-5" />
              {isLoading ? 'Создание образа...' : 'Создать новый образ'}
            </button>
          </div>
          
          <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-zinc-800 flex flex-col">
            <h2 className="text-xl font-semibold text-zinc-100 border-b border-zinc-800 pb-4 mb-6">2. Ваш новый стиль</h2>
            <ResultDisplay isLoading={isLoading} generatedImage={generatedImage} error={error} onContinue={handleContinueStyling} />
          </div>
        </div>

        <Faq />
      </main>

       <footer className="w-full max-w-6xl text-center mt-12 text-zinc-500 text-sm">
        <p>Создано в Alavenir с любовью и применением технологий Google AI</p>
      </footer>
    </div>
  );
};

export default App;