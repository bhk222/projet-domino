
import React, { useReducer, useMemo, useEffect } from 'react';
import { Team, RoundScores, GameRecord, WinType } from './types';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import WinnerDisplay from './components/WinnerDisplay';
import PenaltyDisplay from './components/PenaltyDisplay';
import Header from './components/Header';
import ChaoticNames from './components/ChaoticNames';
import GameHistory from './components/GameHistory';

type GameView = 'setup' | 'game' | 'history';

type GameOutcome = {
  winner: Team;
  loser: Team;
  winType: WinType;
  teamTotals: { [key: string]: number };
};

type GameState = {
  teams: Team[];
  roundScores: RoundScores[];
  targetScore: number;
  view: GameView;
  penaltyTeamId: string | null; // For mid-game penalty
  gameOutcome: GameOutcome | null; // For end-of-game display
  gameHistory: GameRecord[];
};

type GameAction =
  | { type: 'SET_TARGET_SCORE'; payload: number }
  | { type: 'START_GAME'; payload: { players: [string, string, string, string] } }
  | { type: 'ADD_ROUND'; payload: RoundScores }
  | { type: 'NEW_GAME' }
  | { type: 'RESET_APP' }
  | { type: 'CONFIRM_PENALTY' }
  | { type: 'SHOW_HISTORY' }
  | { type: 'SHOW_SETUP' }
  | { type: 'CLEAR_HISTORY' };

const getInitialState = (): GameState => {
    let savedHistory: GameRecord[] = [];
    try {
        const savedData = localStorage.getItem('dominoGameHistory');
        if (savedData) {
            savedHistory = JSON.parse(savedData);
        }
    } catch (error) {
        console.error("Failed to load game history from localStorage", error);
        savedHistory = [];
    }
    
    return {
        teams: [],
        roundScores: [],
        targetScore: 100,
        view: 'setup',
        penaltyTeamId: null,
        gameOutcome: null,
        gameHistory: savedHistory,
    };
};


function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_TARGET_SCORE':
      return { ...state, targetScore: action.payload > 0 ? action.payload : 1 };
    case 'START_GAME':
      const { players } = action.payload;
      const [p1, p2, p3, p4] = players;
      if (p1 && p2 && p3 && p4) {
        const newTeams: Team[] = [
          { id: 'team1', name: `${p1} و ${p2}`, players: [p1, p2] },
          { id: 'team2', name: `${p3} و ${p4}`, players: [p3, p4] },
        ];
        return {
          ...getInitialState(),
          gameHistory: state.gameHistory,
          targetScore: state.targetScore,
          teams: newTeams,
          view: 'game',
        };
      }
      return state;
    case 'ADD_ROUND': {
      const newRoundScores = [...state.roundScores, action.payload];
      const totals: { [key: string]: number } = {};
      state.teams.forEach(t => {
        totals[t.id] = newRoundScores.reduce((sum, round) => sum + (round[t.id] || 0), 0);
      });
      
      const potentialWinners = state.teams.filter(team => totals[team.id] >= state.targetScore);

      // Mid-game penalty check (no winner yet)
      if (potentialWinners.length === 0) {
          const penalizedTeam = state.teams.find(t => totals[t.id] === 106);
          if (penalizedTeam) {
            return { ...state, roundScores: newRoundScores, penaltyTeamId: penalizedTeam.id };
          }
          return { ...state, roundScores: newRoundScores };
      }

      // --- End of Game Logic ---
      const winnerTeam = potentialWinners.length > 1 
          ? potentialWinners.reduce((w, p) => (totals[p.id] > totals[w.id] ? p : w))
          : potentialWinners[0];
      const loserTeam = state.teams.find(t => t.id !== winnerTeam.id)!;
      
      const totalScoreOfLoser = totals[loserTeam.id];
      let winType: WinType;

      // Determine win type with new priority: 106 > total abayd > standard
      if (totalScoreOfLoser === 106) {
        winType = 'penalty_106';
      } else if (totalScoreOfLoser === 0) {
        winType = 'total_abyad';
      } else {
        winType = 'standard';
      }

      const gameRecord: GameRecord = {
          id: new Date().toISOString(),
          winner: winnerTeam,
          loser: loserTeam,
          winnerScore: totals[winnerTeam.id],
          loserScore: totalScoreOfLoser,
          winType,
          date: new Date().toISOString(),
          rounds: newRoundScores,
      };
      
      const newHistory = [...state.gameHistory, gameRecord];

      return {
        ...state,
        roundScores: newRoundScores,
        gameHistory: newHistory,
        gameOutcome: {
          winner: winnerTeam,
          loser: loserTeam,
          winType: winType,
          teamTotals: totals,
        },
        penaltyTeamId: null, // Clear mid-game penalty if game ends
      };
    }
    case 'CONFIRM_PENALTY': {
      if (!state.penaltyTeamId) return state;
      const totals: { [key: string]: number } = {};
      state.teams.forEach(t => {
        totals[t.id] = state.roundScores.reduce((sum, round) => sum + (round[t.id] || 0), 0);
      });
      const penaltyAmount = totals[state.penaltyTeamId];
      const adjustmentRound: RoundScores = { [state.penaltyTeamId]: -penaltyAmount };
      state.teams.forEach(t => { if (t.id !== state.penaltyTeamId) { adjustmentRound[t.id] = 0; } });
      return { ...state, roundScores: [...state.roundScores, adjustmentRound], penaltyTeamId: null };
    }
    case 'NEW_GAME':
      return { 
        ...state, 
        roundScores: [], 
        gameOutcome: null,
        penaltyTeamId: null,
        view: 'game',
      };
    case 'RESET_APP':
      return {
          ...getInitialState(),
          gameHistory: state.gameHistory, // Keep history on reset
      };
    case 'SHOW_HISTORY':
        return { ...state, view: 'history' };
    case 'SHOW_SETUP':
        return { ...state, view: 'setup' };
    case 'CLEAR_HISTORY':
        localStorage.removeItem('dominoGameHistory');
        return { ...state, gameHistory: [] };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  useEffect(() => {
    try {
        localStorage.setItem('dominoGameHistory', JSON.stringify(state.gameHistory));
    } catch (error) {
        console.error("Failed to save game history to localStorage", error);
    }
  }, [state.gameHistory]);

  const teamTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    if (state.teams.length === 0) return totals;
    state.teams.forEach(t => {
      totals[t.id] = state.roundScores.reduce((sum, round) => sum + (round[t.id] || 0), 0);
    });
    return totals;
  }, [state.teams, state.roundScores]);

  const renderContent = () => {
      // Don't render setup/game board if a result is showing
      if (state.gameOutcome || state.penaltyTeamId) {
          if (state.view === 'history') {
            // Allow history to render over game board, but not over modals
          } else {
             return null;
          }
      }

      switch(state.view) {
        case 'history':
            return <GameHistory 
                        history={state.gameHistory} 
                        onBack={() => dispatch({ type: state.teams.length > 0 ? 'SHOW_SETUP' : 'SHOW_SETUP'})}
                        onClearHistory={() => {
                            if(window.confirm("هل أنت متأكد أنك تريد حذف كل سجل المباريات؟ لا يمكن التراجع عن هذا الإجراء.")) {
                                dispatch({ type: 'CLEAR_HISTORY' })
                            }
                        }}
                    />;
        case 'game':
            return <GameBoard state={state} dispatch={dispatch} teamTotals={teamTotals} />;
        case 'setup':
        default:
            return <PlayerSetup targetScore={state.targetScore} dispatch={dispatch} />;
      }
  }

  return (
    <div className="relative min-h-screen text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8 font-['Tajawal'] overflow-hidden">
      <ChaoticNames />
      <div className="relative z-10 w-full flex flex-col items-center">
        <Header onHistoryClick={() => dispatch({ type: 'SHOW_HISTORY' })} />
        <main className="w-full max-w-4xl mx-auto mt-8">
          
          {/* Mid-game Penalty Modal */}
          {state.penaltyTeamId && !state.gameOutcome && (
            <PenaltyDisplay
              team={state.teams.find(t => t.id === state.penaltyTeamId)!}
              onConfirm={() => dispatch({ type: 'CONFIRM_PENALTY' })}
              isEndOfGame={false}
            />
          )}

          {/* End-game Modals */}
          {state.gameOutcome && (
            state.gameOutcome.winType === 'penalty_106' ? (
                <PenaltyDisplay
                    team={state.gameOutcome.loser}
                    isEndOfGame={true}
                    onNewGame={() => dispatch({ type: 'NEW_GAME' })}
                    onResetApp={() => dispatch({ type: 'RESET_APP' })}
                />
            ) : (
                <WinnerDisplay 
                    winner={state.gameOutcome.winner} 
                    loser={state.gameOutcome.loser}
                    teamTotals={state.gameOutcome.teamTotals}
                    winType={state.gameOutcome.winType}
                    onNewGame={() => dispatch({ type: 'NEW_GAME' })}
                    onResetApp={() => dispatch({ type: 'RESET_APP' })}
                />
            )
          )}

          {renderContent()}

        </main>
      </div>
    </div>
  );
}

export default App;