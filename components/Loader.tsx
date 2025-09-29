
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <div
      className="w-12 h-12 rounded-full animate-spin
      border-4 border-solid border-purple-500 border-t-transparent"
    ></div>
    <p className="text-gray-300 font-medium">Generating your new style...</p>
    <p className="text-sm text-gray-500">This can take a moment.</p>
  </div>
);
