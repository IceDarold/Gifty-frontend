import React, { useState, useMemo } from 'react';
import { GiftReviews } from '../types';
import { UGCLightbox } from './UGCLightbox';

interface Props {
  reviews: GiftReviews;
}

export const ReviewsSection: React.FC<Props> = ({ reviews }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const allPhotos = useMemo(() => {
    return reviews.items.reduce((acc: string[], item) => {
      if (item.photos) return [...acc, ...item.photos];
      return acc;
    }, []);
  }, [reviews]);

  return (
    <div className="mt-12 pt-8 border-t-4 border-black">
      {/* Header */}
      <div className="bg-black text-acid-green p-4 font-mono text-sm mb-6 flex justify-between items-center">
        <span className="uppercase font-bold blink">>> ACCESSING_USER_OPINIONS...</span>
        <span>
             SCORE: {reviews.rating.toFixed(1)}/5.0
        </span>
      </div>

      {/* Highlights Tag Cloud */}
      {reviews.highlights && (
        <div className="flex flex-wrap gap-2 mb-8">
             {reviews.highlights.map(h => (
               <span key={h} className="font-mono text-xs border-2 border-black bg-white px-2 py-1 uppercase font-bold hover:bg-black hover:text-white transition-colors cursor-help">
                 #{h}
               </span>
             ))}
        </div>
      )}

      {/* Photos Strip */}
      {allPhotos.length > 0 && (
         <div className="mb-8 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
               {allPhotos.map((photo, i) => (
                 <button 
                    key={i} 
                    onClick={() => setLightboxIndex(i)}
                    className="shrink-0 w-24 h-24 border-2 border-black bg-white hover:bg-acid-green p-1 transition-colors relative"
                 >
                    <img src={photo} alt="UGC" className="w-full h-full object-cover grayscale contrast-125" />
                 </button>
               ))}
         </div>
      )}

      {/* Reviews List - Terminal Style */}
      <div className="space-y-4 font-mono text-sm">
          {reviews.items.slice(0, 3).map((item, idx) => (
            <div key={item.id} className="border-l-2 border-black pl-4 py-2 hover:bg-gray-50">
               <div className="text-gray-500 text-xs mb-1 uppercase">
                  [{item.date}] // USER: {item.author} // RATING: {item.rating}
               </div>
               <div className="font-bold leading-relaxed">
                   "{item.text}"
               </div>
            </div>
          ))}
      </div>

      {lightboxIndex !== null && allPhotos.length > 0 && (
         <UGCLightbox 
            images={allPhotos} 
            initialIndex={lightboxIndex} 
            onClose={() => setLightboxIndex(null)} 
         />
      )}
    </div>
  );
};