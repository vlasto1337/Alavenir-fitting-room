import React from 'react';
import { Loader } from './Loader';
import { ImageIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error }) => {
  return (
    <div className="w-full aspect-square bg-black/50 rounded-lg flex items-center justify-center p-2 border border-zinc-800">
      {isLoading && <Loader />}
      
      {!isLoading && error && (
        <div className="text-center text-red-500 px-4">
          <p className="font-semibold">Ошибка генерации</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      
      {!isLoading && !error && generatedImage && (
        <img src={generatedImage} alt="Generated Style" className="w-full h-full object-contain rounded-md" />
      )}
      
      {!isLoading && !error && !generatedImage && (
         <div className="text-center text-zinc-500">
            <ImageIcon className="mx-auto h-16 w-16" />
            <p className="mt-4 font-medium">Ваш новый образ появится здесь</p>
            <p className="text-sm">Выполните шаги слева, чтобы начать</p>
         </div>
      )}
    </div>
  );
};