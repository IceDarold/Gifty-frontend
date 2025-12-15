import React, { useEffect, useState } from 'react';
import { GiftCard } from '../components/GiftCard';
import { Gift } from '../domain/types';
import { api } from '../api';
import { Mascot } from '../components/Mascot';

export const Wishlist: React.FC = () => {
  const [items, setItems] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
        setLoading(true);
        // 1. Get IDs
        const ids = await api.wishlist.getAll();
        // 2. Hydrate
        if (ids.length > 0) {
            const gifts = await api.gifts.getMany(ids);
            setItems(gifts);
        } else {
            setItems([]);
        }
    } catch (e) {
        console.error("Failed to load wishlist", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleShare = () => {
     const ids = items.map(i => i.id).join(',');
     const url = `${window.location.origin}/#/wishlist?ids=${ids}`;
     navigator.clipboard.writeText(url);
     alert('Ссылка скопирована!');
  };

  if (loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-white">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  if (items.length === 0) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
              <Mascot emotion="thinking" className="w-32 h-32 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Здесь пока пусто!</h2>
              <p className="text-indigo-100 mb-6">Сохраняйте понравившиеся идеи, чтобы не потерять их.</p>
          </div>
      );
  }

  return (
    <div className="pt-6 px-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Избранное ({items.length})</h1>
        <button onClick={handleShare} className="text-white bg-white/20 p-2 rounded-lg hover:bg-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onToggleWishlist={loadItems} />
        ))}
      </div>
    </div>
  );
};