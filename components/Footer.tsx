import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-24 pb-32 flex justify-center px-4">
       {/* RECEIPT / BUSINESS CARD OBJECT */}
       <div className="relative bg-white p-6 shadow-floating max-w-md w-full transform rotate-1 texture-paper border-t-4 border-double border-gray-300">
           
           {/* Torn edge effect top */}
           <div className="absolute -top-2 left-0 w-full h-4 bg-white" style={{clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)'}}></div>

           <div className="text-center font-typewriter text-ink space-y-4">
               <div className="border-b-2 border-dashed border-gray-300 pb-4">
                   <h2 className="text-2xl font-bold tracking-widest">GIFTY.AI</h2>
                   <p className="text-[10px] text-gray-500">LABORATORY OF HUMAN AFFECTION</p>
               </div>
               
               <div className="text-xs space-y-1 text-left pl-4">
                   <p>ITEM: FRIENDSHIP.................[PRICELESS]</p>
                   <p>ITEM: ADVICE.....................[FREE]</p>
                   <p>ITEM: IRONY......................[INCLUDED]</p>
               </div>

               <div className="border-t-2 border-dashed border-gray-300 pt-4 text-[10px] text-gray-400 leading-tight">
                   <p className="uppercase mb-2">Disclaimer:</p>
                   <p>
                       We are mere algorithms pretending to be a desk. 
                       Do not trust us with life-altering decisions.
                   </p>
               </div>

               <div className="flex justify-center gap-6 pt-2 font-handwritten text-lg text-blue-600">
                   <a href="#" className="hover:underline hover:rotate-2 decoration-wavy">Instagram</a>
                   <a href="#" className="hover:underline hover:-rotate-2 decoration-wavy">TikTok</a>
               </div>
               
               <div className="text-[8px] text-gray-300 pt-2">
                   RECEIPT #000-2025-AI
               </div>
           </div>
       </div>
    </footer>
  );
};