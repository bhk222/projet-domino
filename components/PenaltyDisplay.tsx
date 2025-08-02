
import React from 'react';
import { Team } from '../types';

const AngryIcon: React.FC<{className: string}> = ({ className }) => (
    <span role="img" aria-label="Angry Face" className={className}>😡</span>
);

interface PenaltyDisplayProps {
  team: Team;
  onConfirm?: () => void;
  onNewGame?: () => void;
  onResetApp?: () => void;
  isEndOfGame: boolean;
}

const PenaltyDisplay: React.FC<PenaltyDisplayProps> = ({ team, onConfirm, onNewGame, onResetApp, isEndOfGame }) => {
  const animationClass = 'animate-zoom-in-out';

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-lg flex justify-center items-center z-50 p-4" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.2), transparent 60%)"
    }}>
      <div className="text-center bg-red-900/30 p-8 rounded-2xl shadow-2xl border border-red-500/30 animate-fade-in-up w-full max-w-lg">
        
        <p className={`text-7xl lg:text-8xl font-black text-red-500 mb-4 ${animationClass}`} style={{textShadow: '0 0 30px rgba(255,100,100,0.9)'}}>
          مئة و ستة
        </p>
        
        <AngryIcon className={`text-8xl my-4 drop-shadow-lg inline-block ${animationClass}`} />
        
        <p className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 my-2 drop-shadow-md">
          {team.name}
        </p>

        {isEndOfGame ? (
            <p className="text-2xl font-bold text-slate-100 mb-8">
                خسر اللعبة بعقوبة!
            </p>
        ) : (
            <>
                <p className="text-xl text-slate-200 mt-2">
                  تمت معاقبتك!
                </p>
                <p className="text-2xl font-bold text-slate-100 mb-8">
                  سيتم إعادة تعيين نتيجتك إلى 0.
                </p>
            </>
        )}
        
        {isEndOfGame ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                    onClick={onNewGame}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
                >
                    مباراة جديدة
                </button>
                <button
                    onClick={onResetApp}
                    className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    العودة إلى البداية
                </button>
            </div>
        ) : (
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white font-bold py-3 px-10 text-lg rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105 shadow-lg hover:shadow-red-500/40"
            >
              متابعة
            </button>
        )}
      </div>
    </div>
  );
};

export default PenaltyDisplay;