
import React, { useState } from 'react';

const UsersIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const TargetIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.847M12 21a9.004 9.004 0 0 1-8.716-6.847M12 21c.534 0 1.056-.052 1.564-.148M12 21a8.958 8.958 0 0 1-1.564-.148M12 3a9.004 9.004 0 0 0-8.716 6.847M12 3a9.004 9.004 0 0 1 8.716 6.847M12 3c.534 0 1.056.052 1.564-.148M12 3a8.958 8.958 0 0 1-1.564-.148M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);


interface PlayerSetupProps {
  targetScore: number;
  dispatch: React.Dispatch<any>;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ targetScore, dispatch }) => {
  const [players, setPlayers] = useState(['', '', '', '']);

  const handlePlayerNameChange = (index: number, name: string) => {
      const newPlayers = [...players];
      newPlayers[index] = name;
      setPlayers(newPlayers);
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.every(p => p.trim())) {
      dispatch({ 
        type: 'START_GAME', 
        payload: { players: players.map(p => p.trim()) } 
      });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">إعدادات اللعبة</h2>
      
      <form onSubmit={handleStartGame} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Team 1 Card */}
          <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="flex items-center text-xl font-semibold text-slate-300">
              <UsersIcon className="h-6 w-6 ml-2 text-cyan-400" />
              الفريق الأول
            </h3>
            <input
              type="text"
              value={players[0]}
              onChange={(e) => handlePlayerNameChange(0, e.target.value)}
              placeholder="اسم اللاعب الأول"
              required
              className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
            <input
              type="text"
              value={players[1]}
              onChange={(e) => handlePlayerNameChange(1, e.target.value)}
              placeholder="اسم اللاعب الثاني"
              required
              className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          {/* Team 2 Card */}
          <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="flex items-center text-xl font-semibold text-slate-300">
              <UsersIcon className="h-6 w-6 ml-2 text-purple-400" />
              الفريق الثاني
            </h3>
             <input
              type="text"
              value={players[2]}
              onChange={(e) => handlePlayerNameChange(2, e.target.value)}
              placeholder="اسم اللاعب الأول"
              required
              className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
             <input
              type="text"
              value={players[3]}
              onChange={(e) => handlePlayerNameChange(3, e.target.value)}
              placeholder="اسم اللاعب الثاني"
              required
              className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <label htmlFor="target-score" className="flex items-center text-xl font-semibold mb-4 text-slate-300">
            <TargetIcon className="h-6 w-6 ml-2 text-slate-400"/>
            النتيجة المستهدفة
          </label>
          <input
            id="target-score"
            type="number"
            value={targetScore}
            onChange={(e) => dispatch({ type: 'SET_TARGET_SCORE', payload: parseInt(e.target.value, 10) || 0 })}
            className="w-full md:w-1/2 bg-slate-700/50 border-2 border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={!players.every(p => p.trim())}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
          >
            بدء اللعبة
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerSetup;
