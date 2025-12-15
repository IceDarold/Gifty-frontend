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
    <div className="mt-12 pt-8 border-t-2 border-dashed border-pencil/30 relative">
      <h3 className="font-typewriter text-sm font-bold uppercase tracking-widest mb-6 bg-gray-100 inline-block px-2">Картотека отзывов</h3>

      {/* Highlights (Sticky Notes) */}
      {reviews.highlights && (
        <div className="flex flex-wrap gap-3 mb-8">
             {reviews.highlights.map((h, i) => (
               <span 
                key={h} 
                className={`
                    font-handwritten text-lg px-3 py-2 shadow-sm border border-black/5
                    ${i % 2 === 0 ? 'bg-yellow-100 rotate-1' : 'bg-pink-100 -rotate-1'}
                `}
               >
                 {h}
               </span>
             ))}
        </div>
      )}

      {/* Photos (Polaroid strip) */}
      {allPhotos.length > 0 && (
         <div className="mb-8 flex gap-4 overflow-x-auto pb-4 pl-2 no-scrollbar">
               {allPhotos.map((photo, i) => (
                 <button 
                    key={i} 
                    onClick={() => setLightboxIndex(i)}
                    className="shrink-0 w-20 h-20 bg-white p-1 shadow-md rotate-2 hover:rotate-0 transition-transform relative border border-gray-200"
                 >
                    <img src={photo} alt="UGC" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                 </button>
               ))}
         </div>
      )}

      {/* Reviews List - Index Cards */}
      <div className="space-y-6">
          {reviews.items.slice(0, 3).map((item, idx) => (
            <div 
                key={item.id} 
                className="bg-white p-4 shadow-paper border-t-4 border-blue-200 relative texture-paper"
            >
               {/* Hole punch graphic */}
               <div className="absolute top-4 right-4 w-3 h-3 bg-gray-100 rounded-full shadow-inner border border-gray-300"></div>

               <div className="flex justify-between items-baseline mb-2 border-b border-blue-100 pb-1">
                  <span className="font-handwritten text-xl text-ink">{item.author}</span>
                  <div className="flex text-yellow-500 text-xs">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}
                  </div>
               </div>
               
               <p className="font-typewriter text-xs text-pencil leading-relaxed">
                   "{item.text}"
               </p>

               <div className="mt-2 text-[10px] text-gray-400 font-sans text-right">
                   {item.date}
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