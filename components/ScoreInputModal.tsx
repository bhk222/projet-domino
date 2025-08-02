import React, { useState } from 'react';
import { Team, RoundScores } from '../types';

interface ScoreInputModalProps {
  teams: Team[];
  onClose: () => void;
  onSave: (scores: RoundScores) => void;
}

const ScoreInputModal: React.FC<ScoreInputModalProps> = ({ teams, onClose, onSave }) => {
  const [scores, setScores] = useState<RoundScores>(() => {
    const initialScores: RoundScores = {};
    teams.forEach(p => {
      initialScores[p.id] = 0;
    });
    return initialScores;
  });

  const handleScoreChange = (teamId: string, value: string) => {
    const score = parseInt(value, 10);
    setScores(prev => ({
      ...prev,
      [teamId]: isNaN(score) ? 0 : score,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(scores);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in-up">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-8 text-center">نتائج الجولة</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {teams.map((team, index) => (
              <div key={team.id}>
                <label htmlFor={`score-${team.id}`} className="text-xl font-medium text-slate-200 mb-2 block">{team.name}</label>
                <input
                  id={`score-${team.id}`}
                  type="number"
                  min="0"
                  value={scores[team.id] === 0 ? '' : scores[team.id]}
                  onChange={(e) => handleScoreChange(team.id, e.target.value)}
                  className="w-full bg-slate-700/50 border-2 border-slate-600 rounded-lg px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="0"
                  autoFocus={index === 0}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreInputModal;