import React, { useState, useEffect, useMemo } from 'react';

const MESSAGES = [
  'Анализируем ваш стиль...',
  'Подбираем идеальный крой...',
  'Прорисовываем детали...',
  'Добавляем последние штрихи...',
  'Магия почти готова...',
];

const PARTICLE_COUNT = 50;

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
  
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      cx: Math.random() * 200,
      cy: Math.random() * 200,
      r: 1 + Math.random() * 1.5,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 4}s`,
    }));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="w-48 h-48 relative text-violet-500">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {particles.map((p, i) => (
             <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="currentColor"
                className="particle"
                style={{
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
            />
          ))}
        </svg>
      </div>
      <p className="text-zinc-300 font-medium text-lg transition-opacity duration-500">{currentMessage}</p>
      <p className="text-sm text-zinc-500">Это может занять некоторое время.</p>
    </div>
  );
};