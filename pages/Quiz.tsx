import React, { useState, useEffect } from 'react';
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

// RPG DIALOGUE BOX COMPONENT
// Moved outside to avoid re-creation on every render and ensure proper typing for children prop
const DialogueBox: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="bg-retro-black border-4 border-white p-4 shadow-pixel mb-6 relative">
        <div className="absolute -top-3 left-4 bg-retro-black px-2 font-pixel text-[10px] text-yellow-400 border-x-2 border-white">
            {title}
        </div>
        {children}
        {/* Blinking cursor at end indicating waiting for input */}
        <div className="absolute bottom-2 right-2 w-2 h-4 bg-white animate-blink"></div>
    </div>
);

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    if (location.state) {
        return { ...INITIAL_ANSWERS, ...(location.state as any) };
    }
    const saved = localStorage.getItem('gifty_draft');
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });

  useEffect(() => {
    localStorage.setItem('gifty_draft', JSON.stringify(answers));
  }, [answers]);

  const updateAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    track('quiz_step', { step: step + 1 });
    if (step === 5) {
      localStorage.setItem('gifty_answers', JSON.stringify(answers));
      navigate('/results');
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
    else navigate('/');
  };

  const isCurrentStepValid = () => {
    switch (step) {
      case 0: return answers.name.length > 0;
      case 1: return answers.ageGroup.length > 0;
      case 2: return answers.relationship.length > 0;
      case 3: return answers.city.length > 0;
      case 4: return answers.interests.length > 0;
      case 5: return answers.budget.length > 0;
      default: return false;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <>
             <DialogueBox title="WIZARD ASKS:">
                 <p className="font-console text-xl leading-relaxed typing-effect">
                    "Welcome, traveler! Before we begin our quest, tell me: <br/>
                    <span className="text-green-400">What is the Target's Name?</span>"
                 </p>
             </DialogueBox>
             <div className="mt-8">
                <input
                    type="text"
                    placeholder="ENTER NAME..."
                    value={answers.name}
                    onChange={(e) => updateAnswer('name', e.target.value)}
                    className="w-full bg-blue-900 border-4 border-white p-4 font-pixel text-sm text-white placeholder-blue-400 outline-none focus:bg-blue-800"
                    autoFocus
                />
             </div>
          </>
        );
      case 1:
        return (
           <>
              <DialogueBox title="QUERY:">
                  <p className="font-console text-xl">"Scan complete. Detecting Age Level... Select appropriate range:"</p>
              </DialogueBox>
              <div className="grid grid-cols-2 gap-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`
                        p-4 border-4 font-pixel text-[10px] text-left hover:bg-white hover:text-black transition-colors relative
                        ${answers.ageGroup === age ? 'bg-white text-black border-yellow-400' : 'bg-transparent border-white text-white'}
                    `}
                  >
                    {answers.ageGroup === age && <span className="absolute right-2 top-2">◄</span>}
                    {age}
                  </button>
                ))}
              </div>
           </>
        );
      case 2:
        return (
          <>
             <DialogueBox title="RELATIONSHIP STATUS:">
                 <p className="font-console text-xl">"Who is this ally to you?"</p>
             </DialogueBox>
             <div className="grid grid-cols-1 gap-2">
              {RELATIONSHIPS.map((rel, i) => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`
                    p-3 border-2 font-console text-xl text-left hover:pl-6 transition-all
                    ${answers.relationship === rel 
                        ? 'bg-green-800 border-green-500 text-white pl-6' 
                        : 'bg-black border-gray-600 text-gray-400'}
                  `}
                >
                  {i+1}. {rel}
                </button>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
             <DialogueBox title="LOCATION DATA:">
                 <p className="font-console text-xl">"Target coordinates required for delivery drone."</p>
             </DialogueBox>
             <input
                type="text"
                placeholder="CITY..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className="w-full bg-blue-900 border-4 border-white p-4 font-pixel text-sm text-white outline-none"
             />
          </>
        );
      case 4:
        return (
          <>
             <DialogueBox title="ANALYSIS:">
                 <p className="font-console text-xl">"Input Target's Skills, Hobbies, and Weaknesses (Interests)."</p>
             </DialogueBox>
             <textarea
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-40 bg-blue-900 border-4 border-white p-4 font-console text-xl text-white outline-none resize-none"
              placeholder="GAMES, PIZZA, SLEEPING..."
            />
          </>
        );
      case 5:
        return (
           <>
             <DialogueBox title="MERCHANT:">
                 <p className="font-console text-xl">"How much Gold are you willing to spend?"</p>
             </DialogueBox>
             <div className="space-y-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`w-full text-left p-4 border-4 font-pixel text-[10px] flex justify-between items-center hover:bg-white/10 ${answers.budget === b ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-400'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && <span className="animate-blink">💰</span>}
                </button>
              ))}
            </div>
           </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-40 px-4 flex flex-col items-center">
      
      {/* BATTLE SCENE LAYOUT */}
      <div className="w-full max-w-md relative">
         
         {/* Top Status Bar */}
         <div className="flex justify-between items-end mb-4 px-2 border-b-2 border-white pb-2">
             <div className="flex flex-col">
                 <span className="font-pixel text-[8px] text-gray-400">QUEST PROGRESS</span>
                 <div className="flex gap-1 mt-1">
                     {[...Array(6)].map((_, i) => (
                         <div key={i} className={`w-8 h-2 ${i <= step ? 'bg-green-500' : 'bg-gray-800'} border border-black`}></div>
                     ))}
                 </div>
             </div>
             <div className="font-pixel text-xs text-yellow-400">LVL {step + 1}</div>
         </div>

         {/* Mascot in "Battle" position */}
         <div className="flex justify-center mb-6">
             <Mascot emotion="thinking" className="w-32 h-32" />
         </div>

         {/* Content Area */}
         <div className="mb-8">
            {renderContent()}
         </div>

         {/* Controls */}
         <div className="flex justify-between gap-4">
             <Button variant="secondary" onClick={prevStep} disabled={step === 0} className="w-1/3 text-[10px]">
                 BACK
             </Button>
             <Button variant="primary" onClick={nextStep} disabled={!isCurrentStepValid()} className="flex-1">
                 {step === 5 ? 'FINISH QUEST' : 'NEXT >'}
             </Button>
         </div>

      </div>
    </div>
  );
};