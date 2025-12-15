import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t-4 border-black bg-black text-white p-8 mb-12">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
               <h2 className="font-display font-black text-6xl md:text-8xl leading-none text-outline-white hover:text-white transition-all cursor-help select-none">
                   THE<br/>END.
               </h2>
           </div>
           
           <div className="font-mono text-xs space-y-4">
               <div className="border border-white p-4">
                   <p className="uppercase font-bold mb-2 text-acid-green">Legal Disclaimer:</p>
                   <p className="opacity-70">
                       We are not responsible for ruined friendships, awkward birthdays, or bad reactions to gifts suggested by our algorithm. The machine feels no remorse.
                   </p>
               </div>
               
               <div className="flex gap-4 text-lg font-bold">
                   <a href="#" className="hover:text-acid-green hover:underline decoration-wavy">INSTAGRAM?</a>
                   <a href="#" className="hover:text-acid-green hover:underline decoration-wavy">TIKTOK?</a>
                   <a href="#" className="hover:text-acid-green hover:underline decoration-wavy">VOID?</a>
               </div>

               <p className="opacity-30 pt-8">
                   GIFTY.AI © 2025 // NO RIGHTS RESERVED // COPY LEFT
               </p>
           </div>
       </div>
    </footer>
  );
};