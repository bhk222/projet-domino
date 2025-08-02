
import React from 'react';
import { Team, WinType } from '../types';
import Fireworks from './Fireworks';

const TrophyIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.624 3.125a.75.75 0 011.06.02l3.003 3.004a.75.75 0 01-1.06 1.06l-1.97-1.97v2.988a3 3 0 01-1.5 2.599l-2.067.975-2.067-.975a3 3 0 01-1.5-2.6V5.219l-1.97 1.97a.75.75 0 11-1.06-1.06l3.003-3.003a.75.75 0 01.181-.177zM4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zm0 3.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zM12 21a.75.75 0 01-.75-.75v-2.25h1.5v2.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
        <path d="M7.125 9.75a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zm11.25 0a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" />
    </svg>
);

interface WinnerDisplayProps {
  winner: Team;
  loser: Team;
  teamTotals: { [key: string]: number };
  winType: 'standard' | 'total_abyad';
  onNewGame: () => void;
  onResetApp: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner, loser, teamTotals, winType, onNewGame, onResetApp }) => {
  const isTotalAbyad = winType === 'total_abyad';

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-lg flex justify-center items-center z-50 p-4">
      <div className="relative text-center bg-slate-800/50 p-8 rounded-2xl shadow-2xl border border-cyan-500/30 animate-fade-in-up w-full max-w-lg" style={{
        backgroundImage: isTotalAbyad
          ? "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), transparent 70%)"
          : "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.2), transparent 60%)"
      }}>
        <Fireworks />
        
        {isTotalAbyad ? (
          <>
            <p className="text-7xl lg:text-8xl font-black mb-4 animate-text-color-change">
              أبيض
            </p>
            <p className="text-2xl font-bold text-slate-300 mt-4">للأسف، الفريق</p>
            <p className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 my-2 drop-shadow-md animate-zoom-in-out">
              {loser.name}
            </p>
            <p className="text-xl text-slate-300">خسر اللعبة بدون تسجيل أي نقطة!</p>
          </>
        ) : (
          <>
            <TrophyIcon className="w-28 h-28 mx-auto text-yellow-400 drop-shadow-lg" />
            <h2 className="text-2xl font-bold text-slate-300 mt-4">الفائزون</h2>
            <p className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 my-2 drop-shadow-md">
              {winner.name}
            </p>
            <p className="text-xl text-slate-300">فاز باللعبة بنتيجة</p>
            <p className="text-4xl lg:text-5xl font-bold text-cyan-400 my-4">{teamTotals[winner.id]} نقطة!</p>
          </>
        )}
        
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
      </div>
    </div>
  );
};

export default WinnerDisplay;