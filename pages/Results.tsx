import React, { useEffect, useState } from 'react';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift, QuizAnswers } from '../domain/types';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { track } from '../utils/analytics';
import { Mascot } from '../components/Mascot';

export const Results: React.FC = () => {
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const stored = localStorage.getItem('gifty_answers');
        if (!stored) {
          navigate('/quiz');
          return;
        }
        setAnswers(JSON.parse(stored));
        const recommendation = await api.recommendations.create(JSON.parse(stored));
        const gifts = await api.gifts.getMany(recommendation.gift_ids);
        setResults(gifts);
      } catch (err) {
        console.error(err);
        setError("SYSTEM_FAILURE. TRY_AGAIN.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Mascot className="mb-8 animate-spin-slow" emotion="thinking" />
        <h2 className="font-display font-black text-4xl uppercase animate-pulse">Computing...</h2>
        <div className="font-mono text-xs mt-4">
            Analyzing social constructs...<br/>
            Judging taste levels...<br/>
            Optimizing for maximum gratitude...
        </div>
      </div>
    );
  }

  if (error) return <div className="p-12 text-center font-mono text-error font-bold text-2xl">{error}</div>;

  return (
    <div className="">
      {/* HEADER */}
      <div className="mb-16 border-b-4 border-black pb-8 pt-8">
          <div className="font-mono text-xs bg-black text-white inline-block px-2 mb-2 rotate-1">
              OUTPUT_GENERATED
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl uppercase leading-[0.8]">
              We found {results.length}<br/>
              Distractions.
          </h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((gift, i) => (
             <div key={gift.id} className={`${i === 0 ? 'md:col-span-2' : ''}`}>
                <GiftCard 
                    gift={gift} 
                    variant="brutal"
                    onClick={(g) => { setSelectedGift(g); setIsModalOpen(true); }}
                />
             </div>
          ))}
      </div>
      
      <div className="mt-24 pt-12 border-t-2 border-dashed border-black text-center">
          <Button variant="ghost" onClick={() => navigate('/quiz')}>
              [ Reject Reality & Try Again ]
          </Button>
      </div>

      {selectedGift && (
        <GiftDetailsModal 
          gift={selectedGift} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          answers={answers}
          onWishlistChange={() => {}}
        />
      )}
    </div>
  );
};