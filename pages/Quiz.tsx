import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { AGE_GROUPS, RELATIONSHIPS, BUDGETS } from '../constants';
import { QuizAnswers } from '../types';

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

  const QuestionCard = ({ title, children, active }: any) => (
      <div className={`
        relative w-full max-w-md bg-white p-8 shadow-paper mb-8 transition-all duration-500
        ${active ? 'opacity-100 rotate-0 scale-100 z-10' : 'opacity-50 blur-[1px] rotate-1 scale-95 grayscale'}
      `}>
         {/* Texture overlay */}
         <div className="absolute inset-0 texture-paper pointer-events-none opacity-50"></div>
         
         {/* Question Number Stamp */}
         <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-typewriter font-bold text-gray-500 shadow-inner">
             {step + 1}
         </div>

         <h2 className="font-handwritten text-3xl mb-6 relative z-10">{title}</h2>
         <div className="relative z-10">{children}</div>
      </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
        case 0:
            return (
                <QuestionCard title="Кто этот счастливчик?" active>
                    <input 
                        autoFocus
                        type="text" 
                        value={answers.name}
                        onChange={e => updateAnswer('name', e.target.value)}
                        placeholder="Впишите имя..."
                        className="w-full bg-transparent border-b-2 border-pencil/30 p-2 font-handwritten text-2xl focus:border-stamp-red outline-none placeholder:text-gray-300"
                        onKeyDown={e => e.key === 'Enter' && answers.name && handleNext()}
                    />
                </QuestionCard>
            );
        case 1:
            return (
                <QuestionCard title="Сколько им лет?" active>
                    <div className="grid grid-cols-2 gap-3">
                        {AGE_GROUPS.map(age => (
                            <button 
                                key={age}
                                onClick={() => { updateAnswer('ageGroup', age); handleNext(); }}
                                className="border border-pencil/20 p-2 rounded-sm font-typewriter text-xs hover:bg-yellow-50 hover:border-yellow-300 transition-colors text-left"
                            >
                                {age}
                            </button>
                        ))}
                    </div>
                </QuestionCard>
            );
        case 2:
            return (
                <QuestionCard title="Кто вы друг другу?" active>
                    <div className="flex flex-wrap gap-2">
                        {RELATIONSHIPS.map(rel => (
                            <button 
                                key={rel}
                                onClick={() => { updateAnswer('relationship', rel); handleNext(); }}
                                className="bg-gray-100 px-3 py-2 rounded-sm font-handwritten text-xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all"
                            >
                                {rel}
                            </button>
                        ))}
                    </div>
                </QuestionCard>
            );
        case 3:
            return (
                <QuestionCard title="Где искать?" active>
                     <input 
                        autoFocus
                        type="text" 
                        value={answers.city}
                        onChange={e => updateAnswer('city', e.target.value)}
                        placeholder="Город..."
                        className="w-full bg-transparent border-b-2 border-pencil/30 p-2 font-handwritten text-2xl focus:border-stamp-red outline-none"
                        onKeyDown={e => e.key === 'Enter' && answers.city && handleNext()}
                    />
                </QuestionCard>
            );
        case 4:
            return (
                <QuestionCard title="Чем увлекаются?" active>
                    <p className="font-typewriter text-xs text-gray-500 mb-2">Напиши списком или через запятую</p>
                    <textarea 
                        autoFocus
                        value={answers.interests}
                        onChange={e => updateAnswer('interests', e.target.value)}
                        placeholder="Котики, рисование, сон..."
                        className="w-full bg-yellow-50 p-4 font-typewriter text-sm outline-none shadow-inner h-32 resize-none border border-yellow-200"
                    />
                </QuestionCard>
            );
        case 5:
            return (
                <QuestionCard title="Бюджет операции?" active>
                    <div className="space-y-2">
                        {BUDGETS.map(b => (
                            <button 
                                key={b}
                                onClick={() => { updateAnswer('budget', b); handleNext(); }}
                                className="block w-full text-left font-typewriter text-sm py-2 px-4 border-b border-dashed border-gray-300 hover:bg-green-50 hover:text-green-800 transition-colors"
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </QuestionCard>
            );
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-32 w-full">
        {/* Progress: Stack of papers effect */}
        <div className="w-full max-w-md mb-8 flex justify-between items-center px-4">
            <button 
                onClick={() => navigate('/')} 
                className="font-handwritten text-xl text-gray-500 hover:text-ink"
            >
                ← Вернуться
            </button>
            <span className="font-typewriter text-xs text-gray-400">Стр. {step + 1} из 6</span>
        </div>

        {renderCurrentStep()}
        
        {step > 0 && step < 5 && (
            <div className="fixed bottom-32 right-4 md:right-32">
                 <Button onClick={handleNext} disabled={false}>
                     Дальше →
                 </Button>
            </div>
        )}
        
        <div ref={bottomRef} />
    </div>
  );
};