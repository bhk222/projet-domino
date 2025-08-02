
import React, { useMemo, useState } from 'react';
import { GameRecord, PlayerStats } from '../types';

interface GameHistoryProps {
  history: GameRecord[];
  onBack: () => void;
  onClearHistory: () => void;
}

const ChartBarIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);


const GameHistory: React.FC<GameHistoryProps> = ({ history, onBack, onClearHistory }) => {
  const [statsView, setStatsView] = useState<'individual' | 'team'>('individual');

  const stats = useMemo(() => {
    const playerStats: { [name: string]: PlayerStats } = {};
    const teamStats: { [teamId: string]: PlayerStats } = {};
    let abyadWins = 0;
    let penaltyLosses = 0;

    history.forEach(game => {
      if (game.winType === 'total_abyad') abyadWins++;
      if (game.winType === 'penalty_106') {
          penaltyLosses++;
      }

      // Initialize all players involved in the game
      const allPlayers = [...game.winner.players, ...game.loser.players];
      allPlayers.forEach(name => {
        if (!playerStats[name]) {
          playerStats[name] = { gamesPlayed: 0, wins: 0, losses: 0, abyadLosses: 0 };
        }
      });
      
      // Update winner stats
      game.winner.players.forEach(name => {
          playerStats[name].gamesPlayed++;
          playerStats[name].wins++;
      });
      
      // Update loser stats
      game.loser.players.forEach(name => {
          playerStats[name].gamesPlayed++;
          playerStats[name].losses++;
          if (game.winType === 'total_abyad') {
            playerStats[name].abyadLosses++;
          }
      });

      // Team Stats
      const winnerTeamId = [...game.winner.players].sort().join(' و ');
      const loserTeamId = [...game.loser.players].sort().join(' و ');

      if (!teamStats[winnerTeamId]) {
        teamStats[winnerTeamId] = { gamesPlayed: 0, wins: 0, losses: 0, abyadLosses: 0 };
      }
      if (!teamStats[loserTeamId]) {
        teamStats[loserTeamId] = { gamesPlayed: 0, wins: 0, losses: 0, abyadLosses: 0 };
      }
      teamStats[winnerTeamId].gamesPlayed++;
      teamStats[winnerTeamId].wins++;
      teamStats[loserTeamId].gamesPlayed++;
      teamStats[loserTeamId].losses++;
      if (game.winType === 'total_abyad') {
        teamStats[loserTeamId].abyadLosses++;
      }
    });
    
    return {
      totalGames: history.length,
      abyadWins,
      penaltyLosses,
      playerStats,
      teamStats,
    };
  }, [history]);
  
  const sortedPlayers = Object.entries(stats.playerStats).sort(([, a], [, b]) => b.wins - a.wins);
  const sortedTeams = Object.entries(stats.teamStats).sort(([, a], [, b]) => b.wins - a.wins);

  const statsTitle = statsView === 'individual' ? 'إحصائيات فردية' : 'إحصائيات الفرق';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in-up w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">سجل المباريات</h2>
        <button onClick={onBack} className="bg-slate-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors">
          العودة
        </button>
      </div>

    {history.length === 0 ? (
         <div className="text-center py-16 text-slate-500">
            <ChartBarIcon className="h-20 w-20 mx-auto mb-4 text-slate-600" />
            <h3 className="text-2xl font-semibold text-slate-400">لا يوجد سجل مباريات</h3>
            <p className="mt-2">أكمل لعبة لحفظها هنا.</p>
        </div>
    ) : (
      <>
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/70 p-4 rounded-lg text-center">
                <p className="text-slate-400 text-sm">مجموع المباريات</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.totalGames}</p>
            </div>
            <div className="bg-slate-800/70 p-4 rounded-lg text-center">
                <p className="text-slate-400 text-sm">انتصارات "أبيض"</p>
                <p className="text-3xl font-bold text-white">{stats.abyadWins}</p>
            </div>
             <div className="bg-slate-800/70 p-4 rounded-lg text-center">
                <p className="text-slate-400 text-sm">خسائر عقوبة "106"</p>
                <p className="text-3xl font-bold text-red-500">{stats.penaltyLosses}</p>
            </div>
        </div>

        {/* Stats View Toggle */}
        <div className="flex justify-center mb-4 bg-slate-800/70 rounded-lg p-1">
            <button 
                onClick={() => setStatsView('individual')}
                className={`w-1/2 py-2 rounded-md font-bold transition-colors ${statsView === 'individual' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                إحصائيات فردية
            </button>
            <button 
                onClick={() => setStatsView('team')}
                className={`w-1/2 py-2 rounded-md font-bold transition-colors ${statsView === 'team' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                إحصائيات الفرق
            </button>
        </div>

        {/* Player/Team Stats Table */}
        <h3 className="text-2xl font-bold mb-4 text-slate-300 text-center">{statsTitle}</h3>
        <div className="overflow-x-auto mb-8">
            {statsView === 'individual' ? (
                <table className="w-full text-center">
                    <thead className="border-b-2 border-slate-600">
                        <tr>
                            <th className="p-3 text-right">اللاعب</th>
                            <th className="p-3">لعب</th>
                            <th className="p-3">فاز</th>
                            <th className="p-3">خسر</th>
                            <th className="p-3 text-blue-400">أبيض</th>
                            <th className="p-3">نسبة الفوز</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map(([name, pStats]) => (
                            <tr key={name} className="border-b border-slate-700/50">
                                <td className="p-3 text-right font-bold">{name}</td>
                                <td className="p-3">{pStats.gamesPlayed}</td>
                                <td className="p-3 text-green-400">{pStats.wins}</td>
                                <td className="p-3 text-red-400">{pStats.losses}</td>
                                <td className="p-3 text-blue-400 font-bold">{pStats.abyadLosses}</td>
                                <td className="p-3 font-mono">{pStats.gamesPlayed > 0 ? ((pStats.wins / pStats.gamesPlayed) * 100).toFixed(0) : 0}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                 <table className="w-full text-center">
                    <thead className="border-b-2 border-slate-600">
                        <tr>
                            <th className="p-3 text-right">الفريق</th>
                            <th className="p-3">لعب</th>
                            <th className="p-3">فاز</th>
                            <th className="p-3">خسر</th>
                            <th className="p-3 text-blue-400">أبيض</th>
                            <th className="p-3">نسبة الفوز</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTeams.map(([name, tStats]) => (
                            <tr key={name} className="border-b border-slate-700/50">
                                <td className="p-3 text-right font-bold">{name}</td>
                                <td className="p-3">{tStats.gamesPlayed}</td>
                                <td className="p-3 text-green-400">{tStats.wins}</td>
                                <td className="p-3 text-red-400">{tStats.losses}</td>
                                <td className="p-3 text-blue-400 font-bold">{tStats.abyadLosses}</td>
                                <td className="p-3 font-mono">{tStats.gamesPlayed > 0 ? ((tStats.wins / tStats.gamesPlayed) * 100).toFixed(0) : 0}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* Game Log */}
        <h3 className="text-2xl font-bold mb-4 text-slate-300">سجل اللعب</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {history.slice().reverse().map(game => (
                <div key={game.id} className="bg-slate-800/70 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg">{game.winner.name} <span className="text-green-400">vs</span> {game.loser.name}</p>
                        <p className="text-sm text-slate-400">
                            {new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(game.date))}
                        </p>
                    </div>
                     <div className="text-left flex items-center gap-2">
                        <p className="font-bold text-xl">{game.winnerScore} - {game.loserScore}</p>
                        <div className='flex flex-col gap-1'>
                            {game.winType === 'total_abyad' && <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">أبيض</span>}
                            {game.winType === 'penalty_106' && <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">عقوبة 106</span>}
                        </div>
                     </div>
                </div>
            ))}
        </div>
         <div className="mt-8 text-center">
                <button onClick={onClearHistory} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 py-2 px-4 rounded-lg transition-colors">
                    حذف كل السجل
                </button>
            </div>
      </>
    )}
    </div>
  );
};

export default GameHistory;