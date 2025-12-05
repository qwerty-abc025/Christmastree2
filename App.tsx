import React, { useState } from 'react';
import Scene from './components/Scene';
import { TreeState } from './types';

const App: React.FC = () => {
  // Start in FORMED state (Tree shape) instead of CHAOS
  const [treeState, setTreeState] = useState<TreeState>(TreeState.FORMED);

  const toggleState = () => {
    setTreeState((prev) => (prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS));
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-['Fredoka']">
      
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0 cursor-pointer">
        <Scene treeState={treeState} onToggle={toggleState} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Header - One line, smaller, cartoonish, with Miffy Image */}
        <div className="w-full flex justify-center items-center pt-6 pointer-events-auto select-none gap-4">
          <h1 className="text-3xl md:text-4xl text-[#D4AF37] drop-shadow-[0_4px_4px_rgba(212,175,55,0.4)] tracking-wide font-bold whitespace-nowrap">
            ZSQ's Christmas Tree
          </h1>
          {/* Miffy High-Fidelity "Image" Style SVG */}
          <div className="relative drop-shadow-xl filter">
            <svg width="60" height="70" viewBox="0 0 100 120">
               <g transform="rotate(-5, 50, 60)">
                 {/* Music Notes */}
                 <path d="M10 20 Q15 10 25 15 L25 35 A3 3 0 1 1 20 35 L20 20 Z" fill="#FF4444" stroke="black" strokeWidth="2" />
                 <path d="M85 30 Q90 20 95 25 L95 45 A3 3 0 1 1 90 45 L90 30 Z" fill="#FFEB3B" stroke="black" strokeWidth="2" />

                 {/* Ears */}
                 <ellipse cx="35" cy="25" rx="9" ry="24" fill="white" stroke="black" strokeWidth="3.5" />
                 <ellipse cx="65" cy="25" rx="9" ry="24" fill="white" stroke="black" strokeWidth="3.5" />
                 
                 {/* Head */}
                 <ellipse cx="50" cy="58" rx="34" ry="30" fill="white" stroke="black" strokeWidth="3.5" />
                 
                 {/* Eyes */}
                 <circle cx="38" cy="55" r="3.5" fill="black" />
                 <circle cx="62" cy="55" r="3.5" fill="black" />
                 
                 {/* Mouth X */}
                 <path d="M46 64 L54 70 M54 64 L46 70" stroke="black" strokeWidth="2.5" strokeLinecap="round" />

                 {/* Arms (Outstretched Dancing) */}
                 <path d="M15 75 Q25 80 30 85" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                 <circle cx="14" cy="74" r="5.5" fill="white" stroke="black" strokeWidth="3.5" />

                 <path d="M85 75 Q75 80 70 85" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                 <circle cx="86" cy="74" r="5.5" fill="white" stroke="black" strokeWidth="3.5" />

                 {/* Body (Yellow Shirt) */}
                 <path d="M28 85 L22 105 Q50 115 78 105 L72 85 Z" fill="#FFEB3B" stroke="black" strokeWidth="3.5" strokeLinejoin="round" />
                 
                 {/* Legs (One up for dancing) */}
                 <ellipse cx="35" cy="112" rx="9" ry="7" fill="white" stroke="black" strokeWidth="3.5" />
                 <ellipse cx="65" cy="108" rx="9" ry="7" fill="white" stroke="black" strokeWidth="3.5" transform="rotate(-15, 65, 108)" />
               </g>
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-end pb-8 pointer-events-auto select-none">
           <h2 className="text-4xl md:text-5xl text-[#FF4444] drop-shadow-md font-bold tracking-widest animate-pulse">
            MERRY CHRISTMAS
           </h2>
        </div>
      </div>
      
    </div>
  );
};

export default App;