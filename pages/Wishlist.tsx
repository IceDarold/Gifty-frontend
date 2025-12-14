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
    <div className="animate-reveal">
      <div className="flex justify-between items-end mb-12 border-b border-ink pb-4">
          <h1 className="font-serif text-3xl">Archives</h1>
          <span className="font-mono text-xs">{items.length} Object(s) Stored</span>
      </div>

      {loading ? (
           <div className="font-mono text-xs">Retrieving data...</div>
      ) : items.length === 0 ? (
           <div className="py-24 text-center">
               <Mascot emotion="thinking" className="mb-4" />
               <p className="font-mono text-sm text-graphite">Memory Banks Empty.</p>
           </div>
      ) : (
           <div>
               {/* HEADER */}
               <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-ink/20 font-mono text-[10px] uppercase tracking-widest text-graphite mb-4">
                   <div className="col-span-1">Ref_ID</div>
                   <div className="col-span-5">Object Description</div>
                   <div className="col-span-2">Category</div>
                   <div className="col-span-2 text-right">Value</div>
                   <div className="col-span-2 text-right">Action</div>
               </div>

               {/* ROWS */}
               {items.map(gift => (
                   <div key={gift.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-ink/5 items-center hover:bg-white transition-colors px-2 cursor-pointer" onClick={() => setSelectedGift(gift)}>
                       <div className="col-span-1 font-mono text-xs text-graphite hidden md:block">#{gift.id}</div>
                       <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                           <img src={gift.image} className="w-10 h-10 object-cover grayscale" />
                           <span className="font-serif text-lg">{gift.title}</span>
                       </div>
                       <div className="col-span-6 md:col-span-2 font-mono text-xs uppercase text-graphite mt-2 md:mt-0">{gift.category}</div>
                       <div className="col-span-6 md:col-span-2 font-mono text-sm text-right mt-2 md:mt-0">{gift.price}</div>
                       <div className="col-span-12 md:col-span-2 text-right mt-2 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="font-mono text-xs uppercase text-accent hover:underline">[Inspect]</span>
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