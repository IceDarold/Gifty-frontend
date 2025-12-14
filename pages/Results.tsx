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
  
  // Modal State
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [wishlistVersion, setWishlistVersion] = useState(0);
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
        
        const parsedAnswers: QuizAnswers = JSON.parse(stored);
        setAnswers(parsedAnswers);
        
        const recommendation = await api.recommendations.create(parsedAnswers);
        const gifts = await api.gifts.getMany(recommendation.gift_ids);
        setResults(gifts);
      } catch (err) {
        console.error(err);
        setError("Calculation Error. Data corrupted.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  const handleGiftClick = (gift: Gift) => {
    track('view_gift_details', { id: gift.id });
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Mascot className="mb-8 animate-pulse" emotion="thinking" />
        <div className="font-mono text-xs uppercase tracking-widest space-y-2">
            <p>Accessing Global Database...</p>
            <p className="text-accent">Matching Patterns...</p>
            <p>Generating Output...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-12 text-center font-mono text-error">{error}</div>;

  const featured = results[0];
  const others = results.slice(1);

  return (
    <div className="animate-reveal">
      
      {/* HEADER: Computation Report */}
      <div className="mb-16 border-b border-ink/20 pb-8">
          <div className="flex justify-between items-end mb-4">
              <h1 className="font-mono text-xs uppercase tracking-widest text-graphite">
                  Computation_Report_#{(Math.random() * 10000).toFixed(0)}
              </h1>
              <div className="font-mono text-xs text-right">
                  Target: <span className="text-ink">{answers?.name}</span><br/>
                  Context: <span className="text-ink">{answers?.relationship}</span>
              </div>
          </div>
          <div className="font-serif text-3xl sm:text-4xl leading-tight">
              Analysis complete. <br/>
              <span className="text-accent">{results.length} matches</span> found based on psychographic profile.
          </div>
      </div>

      {/* FEATURED ITEM (Poster) */}
      {featured && (
          <GiftCard 
            gift={featured} 
            layout="poster"
            onClick={handleGiftClick}
            onToggleWishlist={() => setWishlistVersion(v => v + 1)}
          />
      )}

      {/* INVENTORY GRID (Mixed Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
          {others.map((gift, i) => {
              // Generative layout logic: make some items span 6 cols, others 4 or 3
              // Use index to deterministically assign sizes so it doesn't jump on re-render
              let colSpan = 'md:col-span-4'; // default
              if (i % 5 === 0) colSpan = 'md:col-span-6';
              else if (i % 5 === 1) colSpan = 'md:col-span-6';
              else if (i % 5 === 2) colSpan = 'md:col-span-4';
              else if (i % 5 === 3) colSpan = 'md:col-span-4';
              else colSpan = 'md:col-span-4';

              return (
                <div key={gift.id} className={colSpan}>
                    <GiftCard 
                        gift={gift} 
                        onClick={handleGiftClick}
                        onToggleWishlist={() => setWishlistVersion(v => v + 1)}
                    />
                </div>
              );
          })}
      </div>
      
      <div className="mt-24 pt-12 border-t border-ink/10 text-center flex flex-col items-center gap-4">
          <span className="font-mono text-xs text-graphite">End of Report</span>
          <Button variant="ghost" onClick={() => navigate('/quiz')}>Run New Query</Button>
      </div>

      {selectedGift && (
        <GiftDetailsModal 
          gift={selectedGift} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          answers={answers}
          onWishlistChange={() => setWishlistVersion(v => v + 1)}
        />
      )}
    </div>
  );
};