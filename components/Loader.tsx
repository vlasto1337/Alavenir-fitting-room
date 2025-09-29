import React, { useState, useEffect } from 'react';

const MESSAGES = [
  'Анализируем ваш стиль...',
  'Подбираем идеальный крой...',
  'Прорисовываем детали...',
  'Добавляем последние штрихи...',
  'Магия почти готова...',
];

export const Loader: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessage(prevMessage => {
        const currentIndex = MESSAGES.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % MESSAGES.length;
        return MESSAGES[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="w-24 h-24 relative">
        <div className="gooey-container">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute w-6 h-6 bg-violet-500 rounded-full top-1/2 left-0 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="absolute w-6 h-6 bg-violet-500 rounded-full top-0 left-1/2 transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.25s' }}></div>
            <div className="absolute w-6 h-6 bg-violet-500 rounded-full top-1/2 right-0 transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute w-6 h-6 bg-violet-500 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.75s' }}></div>
          </div>
        </div>
      </div>
      <p className="text-zinc-300 font-medium text-lg transition-opacity duration-500">{currentMessage}</p>
      <p className="text-sm text-zinc-500">Это может занять некоторое время.</p>
    </div>
  );
};