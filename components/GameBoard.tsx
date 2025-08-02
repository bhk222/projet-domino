
import React, { useState, useMemo } from 'react';
import { Team, RoundScores } from '../types';
import ScoreInputModal from './ScoreInputModal';

const PlusIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ArrowPathIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992m0 0h-4.992m4.992 0-3.181-3.183a8.25 8.25 0 0 0-11.667 0L2.985 16.652Z" />
    </svg>
);

const EmptyStateIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
  </svg>
);


interface GameBoardProps {
  state: {
    teams: Team[];
    roundScores: RoundScores[];
    targetScore: number;
  };
  dispatch: React.Dispatch<any>;
  teamTotals: { [key: string]: number };
}

const GameBoard: React.FC<GameBoardProps> = ({ state, dispatch, teamTotals }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveRound = (scores: RoundScores) => {
    dispatch({ type: 'ADD_ROUND', payload: scores });
    setIsModalOpen(false);
  };

  const cumulativeScores = useMemo(() => {
    const totals: { [teamId: string]: number[] } = {};
    if (!state.teams.length) return totals;

    state.teams.forEach(team => {
        let currentTotal = 0;
        totals[team.id] = state.roundScores.map(round => {
            currentTotal += (round[team.id] || 0);
            return currentTotal;
        });
    });
    return totals;
  }, [state.teams, state.roundScores]);
  
  if (!state.teams || state.teams.length < 2) {
    return null; // or a loading/error state
  }

  const [team1, team2] = state.teams;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">جدول النتائج</h2>
                <p className="text-slate-400">النتيجة المستهدفة: <span className="font-bold text-cyan-300 text-lg">{state.targetScore}</span></p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-md hover:shadow-cyan-500/30"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>إضافة جولة</span>
                </button>
                 <button
                    onClick={() => dispatch({ type: 'RESET_APP' })}
                    className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                    <ArrowPathIcon className="h-5 w-5" />
                    <span>لعبة جديدة</span>
                </button>
            </div>
        </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead className="border-b-2 border-slate-600">
            <tr>
              <th className="p-4 font-bold text-slate-300 rounded-tr-lg">الجولة</th>
              <th className="p-4 font-bold text-slate-300 text-lg sm:text-xl">{team1.name}</th>
              <th className="p-4 font-bold text-slate-300 text-lg sm:text-xl rounded-tl-lg">{team2.name}</th>
            </tr>
          </thead>
          
          {state.roundScores.length > 0 && (
            <>
              <tbody>
                {state.roundScores.map((round, roundIndex) => {
                  const isPenaltyRound = Object.values(round).some(score => score < 0);
                  const penaltyRoundsBefore = state.roundScores.slice(0, roundIndex).filter(r => Object.values(r).some(s => s < 0)).length;
                  const displayRoundNumber = roundIndex + 1 - penaltyRoundsBefore;

                  return (
                    <tr key={roundIndex} className={`border-b border-slate-700/50 ${isPenaltyRound ? 'bg-red-900/30' : 'hover:bg-slate-700/40'}`}>
                      <td className={`p-4 font-bold text-lg ${isPenaltyRound ? 'text-red-400' : 'text-slate-200'}`}>
                        {isPenaltyRound ? 'عقوبة 106' : displayRoundNumber}
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col leading-tight">
                          <span className={`font-bold text-xl ${isPenaltyRound ? 'text-red-400/80' : 'text-slate-100'}`}>{round[team1.id]}</span>
                          <span className="text-xs text-slate-400 mt-1">({cumulativeScores[team1.id]?.[roundIndex] || 0})</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col leading-tight">
                          <span className={`font-bold text-xl ${isPenaltyRound ? 'text-red-400/80' : 'text-slate-100'}`}>{round[team2.id]}</span>
                          <span className="text-xs text-slate-400 mt-1">({cumulativeScores[team2.id]?.[roundIndex] || 0})</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="border-t-2 border-slate-600">
                  <tr>
                      <td className="p-4 font-bold text-xl text-slate-300 rounded-br-lg">المجموع</td>
                      <td className="p-4 text-3xl font-bold text-cyan-400">
                          {teamTotals[team1.id] || 0}
                      </td>
                      <td className="p-4 text-3xl font-bold text-cyan-400 rounded-bl-lg">
                          {teamTotals[team2.id] || 0}
                      </td>
                  </tr>
              </tfoot>
            </>
          )}
        </table>
        {state.roundScores.length === 0 && (
            <div className="text-center py-12 text-slate-500 border-t-2 border-dashed border-slate-700 mt-2">
                <EmptyStateIcon className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-semibold text-slate-400">لم تبدأ اللعبة بعد</h3>
                <p className="mt-1">انقر على "إضافة جولة" لبدء تسجيل النقاط.</p>
            </div>
        )}
      </div>

      {isModalOpen && (
        <ScoreInputModal
          teams={state.teams}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRound}
        />
      )}
    </div>
  );
};

export default GameBoard;
