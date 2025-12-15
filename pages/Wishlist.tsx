import React, { useEffect, useState } from 'react';
import { Gift } from '../domain/types';
import { api } from '../api';
import { Mascot } from '../components/Mascot';
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
    <div className="">
      <div className="border-b-4 border-black pb-8 mb-12">
          <h1 className="font-display font-black text-6xl uppercase leading-[0.8]">
              Evidence<br/>Locker
          </h1>
          <div className="mt-4 font-mono bg-black text-white inline-block px-2">
              COUNT: {items.length} OBJECTS RETAINED
          </div>
      </div>

      {loading ? (
           <div className="font-mono text-xl animate-pulse">Scanning database...</div>
      ) : items.length === 0 ? (
           <div className="py-24 border-2 border-dashed border-gray-300 text-center">
               <Mascot emotion="cool" className="mb-8" />
               <h2 className="font-display text-2xl font-bold">THE VOID IS EMPTY.</h2>
               <p className="font-mono text-sm mt-2">You desire nothing. That is suspicious.</p>
           </div>
      ) : (
           <div className="border-2 border-black">
               {/* HEADER */}
               <div className="hidden md:grid grid-cols-12 bg-black text-white font-mono text-sm uppercase font-bold py-2 px-2 border-b-2 border-black">
                   <div className="col-span-1">ID</div>
                   <div className="col-span-5">Artifact</div>
                   <div className="col-span-2">Class</div>
                   <div className="col-span-2 text-right">Cost</div>
                   <div className="col-span-2 text-right">Status</div>
               </div>

               {/* ROWS */}
               {items.map((gift, idx) => (
                   <div 
                        key={gift.id} 
                        className={`
                            group grid grid-cols-1 md:grid-cols-12 gap-4 py-4 px-2 items-center cursor-pointer hover:bg-acid-green transition-colors
                            ${idx !== items.length - 1 ? 'border-b-2 border-black' : ''}
                        `} 
                        onClick={() => setSelectedGift(gift)}
                   >
                       <div className="col-span-1 font-mono text-xs opacity-50 hidden md:block">#{gift.id.padStart(3, '0')}</div>
                       <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                           <div className="w-12 h-12 border border-black overflow-hidden relative">
                                <img src={gift.image} className="w-full h-full object-cover grayscale contrast-125" />
                                <div className="absolute inset-0 bg-acid-green mix-blend-multiply opacity-0 group-hover:opacity-50"></div>
                           </div>
                           <span className="font-display font-bold text-lg leading-tight uppercase">{gift.title}</span>
                       </div>
                       <div className="col-span-6 md:col-span-2 font-mono text-xs uppercase border border-black px-1 text-center w-max md:w-full mt-2 md:mt-0 bg-white">
                           {gift.category}
                       </div>
                       <div className="col-span-6 md:col-span-2 font-mono text-sm font-bold text-right mt-2 md:mt-0">
                           {gift.price} RUB
                       </div>
                       <div className="col-span-12 md:col-span-2 text-right mt-2 md:mt-0">
                           <span className="font-mono text-xs uppercase bg-black text-white px-2 py-1 group-hover:bg-white group-hover:text-black transition-colors">
                               INSPECT ->
                           </span>
                       </div>
                   </div>
               ))}
           </div>
      )}

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