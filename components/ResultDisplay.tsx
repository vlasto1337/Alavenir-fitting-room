import React, { useRef, useState, useEffect } from 'react';
import { Loader } from './Loader';
import { ImageIcon, DownloadIcon, RedoIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  onContinue?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error, onContinue }) => {
  const hasResult = !isLoading && !error && generatedImage;
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageReady, setIsImageReady] = useState(false);

  // Reset image ready state when a new generation starts
  useEffect(() => {
    if (isLoading) {
      setIsImageReady(false);
    }
  }, [isLoading]);
  
  // Reset image ready state if the generated image is cleared
  useEffect(() => {
    if (!generatedImage) {
      setIsImageReady(false);
    }
  }, [generatedImage]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - top) / height;
    const yPercent = Math.max(0, Math.min(1, y)) * 100;
    imageRef.current.style.transformOrigin = `50% ${yPercent}%`;
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
        imageRef.current.style.transformOrigin = 'center center';
    }
  };

  const showLoader = isLoading || (!isImageReady && generatedImage);
  const showResultImage = hasResult && isImageReady;

  return (
    <div className="flex flex-col h-full">
      <div
        onMouseMove={showResultImage ? handleMouseMove : undefined}
        onMouseLeave={showResultImage ? handleMouseLeave : undefined}
        className="w-full aspect-square bg-black/50 rounded-lg flex items-center justify-center p-2 border border-zinc-800 flex-grow overflow-hidden group relative"
      >
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out ${showLoader ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <Loader />
        </div>
        
        {!isLoading && error && (
          <div className="text-center text-red-500 px-4">
            <p className="font-semibold">Ошибка генерации</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        
        {hasResult && (
          <img 
            ref={imageRef}
            src={generatedImage} 
            alt="Generated Style"
            onLoad={() => { if (!isLoading) setIsImageReady(true); }}
            className={`w-full h-full object-contain rounded-md transition-all duration-700 ease-out group-hover:scale-[2.5] ${showResultImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />
        )}
        
        {!isLoading && !error && !generatedImage && (
           <div className="text-center text-zinc-500">
              <ImageIcon className="mx-auto h-16 w-16" />
              <p className="mt-4 font-medium">Ваш новый образ появится здесь</p>
              <p className="text-sm">Выполните шаги слева, чтобы начать</p>
           </div>
        )}
      </div>

      {showResultImage && (
         <div className="flex items-center gap-2 sm:gap-4 mt-4 w-full">
            <a
                href={generatedImage}
                download={`styled-image-${Date.now()}.png`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-800 rounded-lg transition-colors hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-zinc-600"
            >
                <DownloadIcon className="w-4 h-4" />
                Скачать
            </a>
            <button
                onClick={onContinue}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-lg transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-violet-500"
            >
                <RedoIcon className="w-4 h-4" />
                Дополнить
            </button>
        </div>
      )}
    </div>
  );
};