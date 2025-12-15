import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { AGE_GROUPS, RELATIONSHIPS, BUDGETS } from '../constants';
import { QuizAnswers } from '../types';
import { track } from '../utils/analytics';

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

  // Helper: History Log
  const renderHistory = () => {
    const history = [];
    if (step > 0) history.push({ q: "SUBJECT_NAME", a: answers.name });
    if (step > 1) history.push({ q: "CHRONO_AGE", a: answers.ageGroup });
    if (step > 2) history.push({ q: "SOCIAL_LINK", a: answers.relationship });
    if (step > 3) history.push({ q: "COORDINATES", a: answers.city });
    if (step > 4) history.push({ q: "PSYCH_PROFILE", a: answers.interests });

    return history.map((h, i) => (
        <div key={i} className="mb-2 font-mono text-xs text-gray-400 flex gap-4 border-b border-dashed border-gray-300 pb-1">
            <span className="w-24 shrink-0 uppercase">{h.q}:</span>
            <span className="text-black line-through decoration-acid-green decoration-2">{h.a}</span>
        </div>
    ));
  };

  const renderCurrentStep = () => {
    switch (step) {
        case 0:
            return (
                <div className="animate-glitch">
                    <label className="bg-black text-white text-xs px-2 py-1 mb-2 inline-block -rotate-1">INPUT_01</label>
                    <h2 className="font-display font-bold text-4xl mb-4">Identify the Target.</h2>
                    <input 
                        autoFocus
                        type="text" 
                        value={answers.name}
                        onChange={e => updateAnswer('name', e.target.value)}
                        placeholder="Name or Alias..."
                        className="w-full bg-concrete border-2 border-black p-4 font-mono text-xl focus:bg-acid-green focus:outline-none transition-colors placeholder:text-gray-400"
                        onKeyDown={e => e.key === 'Enter' && answers.name && handleNext()}
                    />
                    <p className="mt-2 text-xs font-mono text-gray-500">We will not contact them. Probably.</p>
                </div>
            );
        case 1:
            return (
                <div>
                    <label className="bg-black text-white text-xs px-2 py-1 mb-2 inline-block rotate-1">INPUT_02</label>
                    <h2 className="font-display font-bold text-4xl mb-6">Age Estimation.</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {AGE_GROUPS.map(age => (
                            <button 
                                key={age}
                                onClick={() => { updateAnswer('ageGroup', age); handleNext(); }}
                                className="text-left font-mono text-lg border-2 border-transparent hover:border-black hover:bg-acid-green p-2 transition-all uppercase"
                            >
                                [ {age} ]
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 2:
            return (
                <div>
                    <label className="bg-black text-white text-xs px-2 py-1 mb-2 inline-block">INPUT_03</label>
                    <h2 className="font-display font-bold text-4xl mb-6">Relation Protocol.</h2>
                    <div className="flex flex-wrap gap-3">
                        {RELATIONSHIPS.map(rel => (
                            <button 
                                key={rel}
                                onClick={() => { updateAnswer('relationship', rel); handleNext(); }}
                                className="font-display font-bold text-2xl hover:text-white hover:bg-black px-2 hover:-rotate-2 transition-all"
                            >
                                {rel}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 3:
            return (
                <div>
                    <label className="bg-black text-white text-xs px-2 py-1 mb-2 inline-block">INPUT_04</label>
                    <h2 className="font-display font-bold text-4xl mb-4">Location Data.</h2>
                    <input 
                        autoFocus
                        type="text" 
                        value={answers.city}
                        onChange={e => updateAnswer('city', e.target.value)}
                        placeholder="City..."
                        className="w-full bg-concrete border-b-4 border-black p-4 font-mono text-xl focus:border-acid-green focus:outline-none"
                        onKeyDown={e => e.key === 'Enter' && answers.city && handleNext()}
                    />
                </div>
            );
        case 4:
            return (
                <div>
                    <label className="bg-black text-white text-xs px-2 py-1 mb-2 inline-block">INPUT_05</label>
                    <h2 className="font-display font-bold text-4xl mb-2">Obsessions.</h2>
                    <p className="font-mono text-xs mb-4">List their hobbies. Be specific.</p>
                    <textarea 
                        autoFocus
                        value={answers.interests}
                        onChange={e => updateAnswer('interests', e.target.value)}
                        placeholder="e.g. Conspiracy theories, Cats, Silence..."
                        className="w-full border-2 border-black p-4 font-mono text-lg outline-none focus:shadow-[4px_4px_0px_#000] h-32 resize-none"
                    />
                </div>
            );
        case 5:
            return (
                <div>
                    <label className="bg-black text-white text-xs px-2 py-1 mb-2 inline-block">INPUT_06</label>
                    <h2 className="font-display font-bold text-4xl mb-6">Monetary Sacrifice.</h2>
                    <div className="space-y-2">
                        {BUDGETS.map(b => (
                            <button 
                                key={b}
                                onClick={() => { updateAnswer('budget', b); handleNext(); }}
                                className="block w-full text-left font-mono font-bold py-3 border-2 border-black hover:bg-black hover:text-white px-4 transition-all"
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
    <div className="min-h-[80vh] flex flex-col justify-end pb-12 px-2 max-w-xl mx-auto">
        <div className="mb-12 border-l-4 border-gray-200 pl-4">
            {renderHistory()}
        </div>
        
        <div className="min-h-[300px]">
            {renderCurrentStep()}
        </div>

        <div className="mt-12 flex justify-between items-center border-t-2 border-black pt-6">
             <div className="font-mono text-xs">
                 PROGRESS: {Math.round(((step)/6)*100)}%
             </div>
             
             {step > 0 && (
                <button 
                    onClick={() => setStep(s => s - 1)}
                    className="font-mono text-xs underline decoration-error"
                >
                    &lt; REVERT
                </button>
             )}

             {(step === 0 || step === 3 || step === 4) && (
                 <Button onClick={handleNext} disabled={step === 0 && !answers.name || step === 3 && !answers.city || step === 4 && !answers.interests}>
                     CONFIRM
                 </Button>
             )}
        </div>
        <div ref={bottomRef} />
    </div>
  );
};