import React, { useState, useMemo } from 'react';
import { GiftReviews, ReviewItem } from '../types';
import { UGCLightbox } from './UGCLightbox';

interface Props {
  reviews: GiftReviews;
}

type FilterType = 'all' | 'with_photos' | 'gift' | '5_star' | '4_star' | 'low_star';

export const ReviewsSection: React.FC<Props> = ({ reviews }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Flatten all photos for lightbox
  const allPhotos = useMemo(() => {
    return reviews.items.reduce((acc: string[], item) => {
      if (item.photos) return [...acc, ...item.photos];
      return acc;
    }, []);
  }, [reviews]);

  const filteredItems = useMemo(() => {
    return reviews.items.filter(item => {
      if (filter === 'with_photos') return item.photos && item.photos.length > 0;
      if (filter === 'gift') return item.tag?.toLowerCase().includes('подар');
      if (filter === '5_star') return item.rating === 5;
      if (filter === '4_star') return item.rating === 4;
      if (filter === 'low_star') return item.rating <= 3;
      return true;
    });
  }, [reviews, filter]);

  const visibleItems = expanded ? filteredItems : filteredItems.slice(0, 3);

  const renderStars = (rating: number) => (
    <div className="flex text-yellow-400 text-xs">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  // Helper to find global photo index to open lightbox correctly
  const openLightbox = (photoUrl: string) => {
    const idx = allPhotos.indexOf(photoUrl);
    if (idx !== -1) setLightboxIndex(idx);
  };

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Отзывы покупателей</h3>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-2xl font-black text-gray-800">{reviews.rating}</span>
             {renderStars(Math.round(reviews.rating))}
             <span className="text-gray-500 text-sm">({reviews.count} отзывов)</span>
          </div>
        </div>
        {reviews.source && (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
            {reviews.source}
          </span>
        )}
      </div>

      {/* Highlights */}
      {reviews.highlights && (
        <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <span className="font-bold text-gray-800">Чаще всего отмечают:</span>
          <div className="flex flex-wrap gap-2 mt-2">
             {reviews.highlights.map(h => (
               <span key={h} className="bg-white px-2 py-1 rounded-md text-xs border border-gray-200 shadow-sm">
                 {h}
               </span>
             ))}
          </div>
        </div>
      )}

      {/* Photos Strip */}
      {allPhotos.length > 0 && (
         <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Фото покупателей</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
               {allPhotos.map((photo, i) => (
                 <button 
                    key={i} 
                    onClick={() => setLightboxIndex(i)}
                    className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative group"
                 >
                    <img src={photo} alt="UGC" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                 </button>
               ))}
            </div>
         </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
         <button 
           onClick={() => setFilter('all')}
           className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${filter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
         >
           Все
         </button>
         {allPhotos.length > 0 && (
            <button 
              onClick={() => setFilter('with_photos')}
              className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${filter === 'with_photos' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
            >
              С фото
            </button>
         )}
         <button 
           onClick={() => setFilter('gift')}
           className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${filter === 'gift' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
         >
           Покупал в подарок
         </button>
         <button 
           onClick={() => setFilter('5_star')}
           className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${filter === '5_star' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
         >
           5 ★
         </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleItems.length > 0 ? (
          visibleItems.map(item => (
            <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
               <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-900">{item.author}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
               </div>
               <div className="flex items-center gap-2 mb-2">
                 {renderStars(item.rating)}
                 {item.tag && (
                   <span className="text-xs text-indigo-500 bg-indigo-50 px-2 rounded-sm">
                     {item.tag}
                   </span>
                 )}
               </div>
               <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
               {item.photos && item.photos.length > 0 && (
                 <div className="flex gap-2 mt-3">
                   {item.photos.map((p, i) => (
                     <img 
                       key={i} 
                       src={p} 
                       onClick={() => openLightbox(p)}
                       alt="review" 
                       className="w-16 h-16 object-cover rounded-lg border border-gray-100 cursor-zoom-in" 
                     />
                   ))}
                 </div>
               )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl">
             <p className="text-gray-500 text-sm">Нет отзывов по выбранному фильтру</p>
             <button onClick={() => setFilter('all')} className="text-indigo-600 text-sm font-bold mt-2">Сбросить фильтры</button>
          </div>
        )}
      </div>

      {filteredItems.length > 3 && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          {expanded ? 'Свернуть' : `Показать еще (${filteredItems.length - 3})`}
        </button>
      )}

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