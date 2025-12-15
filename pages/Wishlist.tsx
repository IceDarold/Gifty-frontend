import React, { useEffect, useState } from 'react';
import { Gift } from '../domain/types';
import { api } from '../api';
import { GiftDetailsModal } from '../components/GiftDetailsModal';

export const Wishlist: React.FC = () => {
  const [items, setItems] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const loadItems = async () => {
    try {
        setLoading(true);
        const ids = await api.wishlist.getAll();
        if (ids.length > 0) {
            const gifts = await api.gifts.getMany(ids);
            setItems(gifts);
        } else {
            setItems([]);
        }
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadItems(); }, []);

  return (
    <div className="w-full min-h-[80vh] relative">
      {/* CORKBOARD BACKGROUND */}
      <div className="absolute inset-0 bg-[#e0cda8] z-0 shadow-inner rounded-lg border-[12px] border-[#8d6e63]" 
           style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cork-board.png")'}}>
      </div>

      <div className="relative z-10 p-8">
          <div className="bg-white p-4 shadow-md rotate-[-1deg] inline-block mb-12 relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-sm z-20"></div>
               <h1 className="font-handwritten text-4xl text-ink">Доска Идей</h1>
               <p className="font-typewriter text-xs text-pencil">Сохранено: {items.length}</p>
          </div>

          {loading ? (
               <div className="font-handwritten text-2xl text-white/50 animate-pulse">Ищем записи...</div>
          ) : items.length === 0 ? (
               <div className="bg-yellow-100 p-8 max-w-sm mx-auto shadow-floating rotate-2 text-center relative">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-tape/60 rotate-1"></div>
                   <p className="font-handwritten text-2xl mb-2">Пусто...</p>
                   <p className="font-typewriter text-sm">Приколите сюда что-нибудь интересное!</p>
               </div>
          ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                   {items.map((gift, idx) => (
                       <div 
                            key={gift.id} 
                            onClick={() => setSelectedGift(gift)}
                            className="bg-white p-2 shadow-paper hover:shadow-floating hover:scale-105 transition-all cursor-pointer relative"
                            style={{transform: `rotate(${idx % 2 === 0 ? '2deg' : '-1deg'})`}}
                       >
                           {/* Push pin */}
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full shadow-sm z-20"></div>
                           
                           <img src={gift.image} className="w-full h-32 object-cover mb-2 filter contrast-110" />
                           <p className="font-handwritten text-lg leading-none">{gift.title}</p>
                           <p className="font-typewriter text-xs text-right mt-1">{gift.price} ₽</p>
                       </div>
                   ))}
               </div>
          )}
      </div>

      {selectedGift && (
        <GiftDetailsModal 
          gift={selectedGift} 
          isOpen={!!selectedGift} 
          onClose={() => setSelectedGift(null)}
          answers={null}
          onWishlistChange={loadItems} 
        />
      )}
    </div>
  );
};