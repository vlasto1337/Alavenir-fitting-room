import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <div
      className="w-12 h-12 rounded-full animate-spin
      border-4 border-solid border-violet-500 border-t-transparent"
    ></div>
    <p className="text-zinc-300 font-medium">Генерируем ваш новый стиль...</p>
    <p className="text-sm text-zinc-500">Это может занять некоторое время.</p>
  </div>
);