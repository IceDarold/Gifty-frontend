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
    <div className="mt-12 border-t border-ink/10 pt-8">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <h3 className="font-mono text-xs uppercase tracking-widest">User_Feedback_Log</h3>
        <div className="font-mono text-sm">
             Rating: <span className="font-bold text-ink">[{reviews.rating.toFixed(1)} / 5.0]</span>
             <span className="text-graphite ml-2">:: n={reviews.count}</span>
        </div>
      </div>

      {/* Highlights Tag Cloud */}
      {reviews.highlights && (
        <div className="flex flex-wrap gap-2 mb-8">
             {reviews.highlights.map(h => (
               <span key={h} className="font-mono text-[10px] border border-ink/20 px-2 py-1 uppercase tracking-wider text-graphite">
                 {h}
               </span>
             ))}
        </div>
      )}

      {/* Photos Strip */}
      {allPhotos.length > 0 && (
         <div className="mb-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               {allPhotos.map((photo, i) => (
                 <button 
                    key={i} 
                    onClick={() => setLightboxIndex(i)}
                    className="shrink-0 w-24 h-24 bg-gray-100 border border-ink/10 hover:border-accent transition-colors relative"
                 >
                    <img src={photo} alt="UGC" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white opacity-50"></div>
                 </button>
               ))}
         </div>
      )}

      {/* Reviews List - Text Only */}
      <div className="space-y-8">
          {reviews.items.slice(0, 3).map(item => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4">
               <div className="col-span-3 font-mono text-xs text-graphite">
                  <div>{item.date}</div>
                  <div>User: {item.author}</div>
                  <div>Score: {item.rating}/5</div>
               </div>
               <div className="col-span-9 font-serif text-lg leading-relaxed border-l border-ink/10 pl-4">
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