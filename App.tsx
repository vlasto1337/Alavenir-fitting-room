
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';
import { SparklesIcon } from './components/icons';

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
    // Clear the other input mode's state when switching
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
        setError('Please upload a photo of yourself.');
        return;
    }
    if (inputMode === 'text' && !prompt.trim()) {
        setError('Please describe the outfit.');
        return;
    }
    if (inputMode === 'image' && !outfitImageFile) {
        setError('Please upload an image of the outfit.');
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt, inputMode, outfitImageFile]);
  
  const canGenerate = originalImageFile && (inputMode === 'text' ? prompt.trim().length > 0 : !!outfitImageFile) && !isLoading;

  const activeTabClass = 'bg-purple-600 text-white font-semibold rounded-md py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400';
  const inactiveTabClass = 'bg-gray-900 text-gray-300 hover:bg-gray-700/50 rounded-md py-2 transition-colors';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          NanoBanana Virtual Try-On
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Upload your photo, describe your new look, and see the magic happen.
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-gray-100 border-b border-gray-700 pb-3">1. Your Setup</h2>
          <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={originalImagePreview} label="Upload your photo:" />
          
          <div className="flex flex-col gap-4">
            <label className="block text-sm font-medium text-gray-300">Describe or upload the outfit:</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-700 p-1">
                <button onClick={() => handleModeChange('text')} className={inputMode === 'text' ? activeTabClass : inactiveTabClass}>
                    Describe
                </button>
                <button onClick={() => handleModeChange('image')} className={inputMode === 'image' ? activeTabClass : inactiveTabClass}>
                    Upload Image
                </button>
            </div>

            {inputMode === 'text' ? (
                 <textarea
                    id="prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'a black leather jacket over a white t-shirt and dark blue jeans'"
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
                />
            ) : (
                <ImageUploader
                    onImageUpload={handleOutfitImageUpload}
                    imagePreviewUrl={outfitImagePreview}
                    label="Upload an image of the outfit:"
                />
            )}
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={!canGenerate}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 ease-in-out
              ${canGenerate
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-600 cursor-not-allowed'
              }`}
          >
            <SparklesIcon />
            {isLoading ? 'Styling Your Image...' : 'Generate New Look'}
          </button>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-100 border-b border-gray-700 pb-3 mb-6">2. Your New Style</h2>
          <ResultDisplay isLoading={isLoading} generatedImage={generatedImage} error={error} />
        </div>
      </main>

       <footer className="w-full max-w-6xl text-center mt-12 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Images are AI-generated and may not be perfect.</p>
      </footer>
    </div>
  );
};

export default App;
