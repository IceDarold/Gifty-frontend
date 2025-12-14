import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { AGE_GROUPS, RELATIONSHIPS, BUDGETS } from '../constants';
import { QuizAnswers } from '../types';
import { track } from '../utils/analytics';
import { Mascot } from '../components/Mascot';

const INITIAL_ANSWERS: QuizAnswers = {
  name: '',
  ageGroup: '',
  relationship: '',
  city: '',
  interests: '',
  budget: ''
};

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    if (location.state) return { ...INITIAL_ANSWERS, ...(location.state as any) };
    const saved = localStorage.getItem('gifty_draft');
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });

  // For scrolling to bottom
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('gifty_draft', JSON.stringify(answers));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  const updateAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 5) {
        navigate('/results');
    } else {
        setStep(s => s + 1);
    }
  };

  // Helper to render completed steps as "Log History"
  const renderHistory = () => {
    const history = [];
    if (step > 0) history.push({ q: "Input: Name", a: answers.name });
    if (step > 1) history.push({ q: "Input: Age", a: answers.ageGroup });
    if (step > 2) history.push({ q: "Input: Relation", a: answers.relationship });
    if (step > 3) history.push({ q: "Input: Location", a: answers.city });
    if (step > 4) history.push({ q: "Input: Interests", a: answers.interests });

    return history.map((h, i) => (
        <div key={i} className="mb-4 opacity-40 font-mono text-xs border-l border-ink pl-3">
            <div className="uppercase tracking-widest mb-1">{h.q}</div>
            <div className="text-lg">{h.a}</div>
        </div>
    ));
  };

  const renderCurrentStep = () => {
    switch (step) {
        case 0:
            return (
                <div className="animate-reveal">
                    <label className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                        Query_01: Target Identity
                    </label>
                    <h2 className="font-serif text-3xl mb-8">Who are we looking for?</h2>
                    <input 
                        autoFocus
                        type="text" 
                        value={answers.name}
                        onChange={e => updateAnswer('name', e.target.value)}
                        placeholder="Type name..."
                        className="w-full bg-transparent border-b border-ink font-serif text-2xl py-2 outline-none placeholder-gray-300 focus:border-accent transition-colors"
                        onKeyDown={e => e.key === 'Enter' && answers.name && handleNext()}
                    />
                </div>
            );
        case 1:
            return (
                <div className="animate-reveal">
                    <label className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                        Query_02: Chronological Age
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {AGE_GROUPS.map(age => (
                            <button 
                                key={age}
                                onClick={() => { updateAnswer('ageGroup', age); handleNext(); }}
                                className="text-left font-serif text-xl py-3 border-b border-gray-200 hover:border-accent hover:text-accent transition-all group"
                            >
                                <span className="opacity-0 group-hover:opacity-100 mr-2 text-accent font-mono text-sm">[x]</span>
                                {age}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 2:
            return (
                <div className="animate-reveal">
                     <label className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                        Query_03: Social Connection
                    </label>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                        {RELATIONSHIPS.map(rel => (
                            <button 
                                key={rel}
                                onClick={() => { updateAnswer('relationship', rel); handleNext(); }}
                                className="font-serif text-xl hover:text-accent hover:underline decoration-1 underline-offset-4"
                            >
                                {rel}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 3:
            return (
                <div className="animate-reveal">
                    <label className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                        Query_04: Geolocation
                    </label>
                    <h2 className="font-serif text-3xl mb-8">Where are they located?</h2>
                    <input 
                        autoFocus
                        type="text" 
                        value={answers.city}
                        onChange={e => updateAnswer('city', e.target.value)}
                        placeholder="City..."
                        className="w-full bg-transparent border-b border-ink font-serif text-2xl py-2 outline-none placeholder-gray-300 focus:border-accent transition-colors"
                        onKeyDown={e => e.key === 'Enter' && answers.city && handleNext()}
                    />
                </div>
            );
        case 4:
            return (
                <div className="animate-reveal">
                    <label className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                        Query_05: Psychographics
                    </label>
                    <h2 className="font-serif text-3xl mb-2">What defines them?</h2>
                    <p className="font-mono text-xs text-gray-400 mb-6">Keywords: Hobbies, Obsessions, Jobs</p>
                    <textarea 
                        autoFocus
                        value={answers.interests}
                        onChange={e => updateAnswer('interests', e.target.value)}
                        placeholder="e.g. Photography, Coffee, Silence..."
                        className="w-full bg-transparent border border-ink/20 p-4 font-serif text-xl outline-none focus:border-accent h-32 resize-none"
                    />
                </div>
            );
        case 5:
            return (
                <div className="animate-reveal">
                    <label className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
                        Query_06: Resource Allocation
                    </label>
                    <div className="space-y-4">
                        {BUDGETS.map(b => (
                            <button 
                                key={b}
                                onClick={() => { updateAnswer('budget', b); handleNext(); }}
                                className="block w-full text-left font-mono text-sm py-4 border-b border-gray-200 hover:bg-ink hover:text-paper px-4 transition-colors"
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
            );
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-end pb-12">
        <div className="mb-12">
            {renderHistory()}
        </div>
        
        <div className="min-h-[300px] flex flex-col justify-center">
            {renderCurrentStep()}
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-ink/10 pt-6">
             <div className="font-mono text-xs text-gray-400">
                 Step {step + 1} / 6
             </div>
             
             {step > 0 && (
                <button 
                    onClick={() => setStep(s => s - 1)}
                    className="font-mono text-xs hover:text-accent"
                >
                    [ Undo ]
                </button>
             )}

             {(step === 0 || step === 3 || step === 4) && (
                 <Button onClick={handleNext} disabled={step === 0 && !answers.name || step === 3 && !answers.city || step === 4 && !answers.interests}>
                     Next
                 </Button>
             )}
        </div>
        <div ref={bottomRef} />
    </div>
  );
};