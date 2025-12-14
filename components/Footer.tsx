import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center border-t-2 border-pop-black bg-white mt-auto">
       <div className="font-display font-bold text-lg mb-2">Gifty.ai</div>
       <div className="text-sm font-medium text-gray-500">
          Сделано с ❤️ и 🤖
       </div>
    </footer>
  );
};