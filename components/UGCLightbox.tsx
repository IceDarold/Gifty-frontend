import React, { useEffect, useState } from 'react';

interface Props {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const UGCLightbox: React.FC<Props> = ({ images, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, onClose]);

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 text-white font-mono text-xl border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-colors z-50 uppercase font-bold"
      >
        [ Close ]
      </button>

      <div className="absolute top-8 left-8 text-white font-mono bg-acid-green text-black px-2 py-1 font-bold z-50">
         IMG_SEQ: {index + 1} / {images.length}
      </div>

      <div className="relative max-w-full max-h-full p-8" onClick={(e) => e.stopPropagation()}>
        <img 
            src={images[index]} 
            alt={`Evidence ${index + 1}`} 
            className="max-h-[80vh] max-w-[90vw] object-contain border-4 border-white grayscale contrast-125"
        />
      </div>

      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-8 z-50">
          <button onClick={prev} className="text-white font-mono text-xl hover:text-acid-green font-bold">&lt; PREV</button>
          <button onClick={next} className="text-white font-mono text-xl hover:text-acid-green font-bold">NEXT &gt;</button>
      </div>
    </div>
  );
};