import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
  label: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl, label }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);

  return (
    <div>
       <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
      <div 
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-violet-500 bg-violet-900/20' : 'border-zinc-700 hover:border-zinc-600'}
        ${imagePreviewUrl ? 'p-0 border-solid' : 'p-4'}`}
      >
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center text-zinc-400">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2">
              <span className="font-semibold text-violet-400">Нажмите для загрузки</span> или перетащите файл
            </p>
            <p className="text-xs">PNG, JPG, WEBP (макс. 4 МБ)</p>
          </div>
        )}
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};