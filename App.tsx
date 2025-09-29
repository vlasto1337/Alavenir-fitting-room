import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';
import { SparklesIcon, LogoIcon } from './components/icons';

const App: React.FC = () => {
  // Person image state
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);

  // Outfit input state
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState<string>('');
  const [outfitImageFile, setOutfitImageFile] = useState<File | null>(null);
  const [outfitImagePreview, setOutfitImagePreview] = useState<string | null>(null);
  
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
  
  const handleOutfitImageUpload = (file: File) => {
    setOutfitImageFile(file);
    setGeneratedImage(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOutfitImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
        outfitImageDetails
      );
      setGeneratedImage(`data:image/jpeg;base64,${newImageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt, inputMode, outfitImageFile]);
  
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

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-zinc-800 flex flex-col gap-6">
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
                 <textarea
                    id="prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="например, 'черная кожаная куртка поверх белой футболки и темно-синие джинсы'"
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors placeholder-zinc-500"
                />
            ) : (
                <ImageUploader
                    onImageUpload={handleOutfitImageUpload}
                    imagePreviewUrl={outfitImagePreview}
                    label="Загрузите фото одежды:"
                />
            )}
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={!canGenerate}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 ease-in-out
              ${canGenerate
                ? 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 transform hover:-translate-y-px'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
          >
            <SparklesIcon className="w-5 h-5" />
            {isLoading ? 'Создание образа...' : 'Создать новый образ'}
          </button>
        </div>
        
        <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100 border-b border-zinc-800 pb-4 mb-6">2. Ваш новый стиль</h2>
          <ResultDisplay isLoading={isLoading} generatedImage={generatedImage} error={error} />
        </div>
      </main>

       <footer className="w-full max-w-6xl text-center mt-12 text-zinc-500 text-sm">
        <p>Создано в Alavenir с любовью и применением технологий Google AI</p>
      </footer>
    </div>
  );
};

export default App;