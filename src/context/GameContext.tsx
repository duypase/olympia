import React, { useEffect, useReducer, useRef } from 'react';
import type { GameAction, GameState, Team } from '../types/game';
import { GameContext } from './context';
import { INITIAL_TEAMS, MOCK_OBSTACLE_DATA, MOCK_ROUND1_QUESTIONS } from '../data/mockQuestions';
import { playCorrect, playTick, playVictory, playWarning, playWrong } from '../utils/audio';

const STORAGE_KEY = 'olympia_trivia_game_state_v1';
const BROADCAST_CHANNEL_NAME = 'olympia_trivia_channel';

const INITIAL_STATE: GameState = {
  round: 1,
  phase: 'IDLE',
  teams: INITIAL_TEAMS,
  activeTeamId: null,
  timerSeconds: MOCK_ROUND1_QUESTIONS[0].timeLimit,
  isTimerRunning: false,
  scoreModifier: 10,
  round1: {
    currentQuestionIndex: 0,
    questions: MOCK_ROUND1_QUESTIONS,
    lastResult: null,
    lastPointsAwarded: 0,
  },
  round2: {
    obstacle: MOCK_OBSTACLE_DATA,
    activeClueId: null,
    obstacleSolvedBy: null,
    lastResult: null,
    lastPointsAwarded: 0,
  },
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SYNC_STATE':
      return action.state;

    case 'SET_ROUND': {
      const newRound = action.round;
      const initialTimer = newRound === 1 
        ? state.round1.questions[state.round1.currentQuestionIndex]?.timeLimit || 12
        : 15;
      return {
        ...state,
        round: newRound,
        phase: 'IDLE',
        activeTeamId: null,
        isTimerRunning: false,
        timerSeconds: initialTimer,
        scoreModifier: newRound === 1 ? 10 : 10,
      };
    }

    case 'START_QUESTION': {
      let seconds = 12;
      if (state.round === 1) {
        seconds = state.round1.questions[state.round1.currentQuestionIndex]?.timeLimit || 12;
      } else if (state.round === 2 && state.round2.activeClueId !== null) {
        const clue = state.round2.obstacle.clues.find(c => c.id === state.round2.activeClueId);
        seconds = clue?.timeLimit || 15;
      }
      return {
        ...state,
        phase: 'QUESTION_ACTIVE',
        activeTeamId: null,
        timerSeconds: seconds,
        isTimerRunning: true,
        scoreModifier: 10,
        round1: {
          ...state.round1,
          lastResult: null,
          lastPointsAwarded: 0,
        },
        round2: {
          ...state.round2,
          lastResult: null,
          lastPointsAwarded: 0,
        },
      };
    }

    case 'PAUSE_TIMER':
      return { ...state, isTimerRunning: false };

    case 'RESUME_TIMER':
      return { ...state, isTimerRunning: true };

    case 'RESET_TIMER':
      return {
        ...state,
        timerSeconds: action.seconds,
        isTimerRunning: false,
      };

    case 'TICK_TIMER': {
      if (!state.isTimerRunning) return state;
      if (state.timerSeconds <= 1) {
        // Hết giờ
        playWrong();
        return {
          ...state,
          timerSeconds: 0,
          isTimerRunning: false,
          phase: 'RESULT_REVEAL',
          round1: {
            ...state.round1,
            lastResult: 'TIMEOUT',
            lastPointsAwarded: 0,
          },
          round2: {
            ...state.round2,
            lastResult: 'TIMEOUT',
            lastPointsAwarded: 0,
          },
        };
      }
      const newSec = state.timerSeconds - 1;
      if (newSec <= 3 && newSec > 0) {
        playWarning();
      } else {
        playTick();
      }
      return { ...state, timerSeconds: newSec };
    }

    case 'SELECT_TEAM_FOR_ANSWER':
      // Dừng timer khi host chọn đội giơ tay
      return {
        ...state,
        activeTeamId: action.teamId,
        phase: 'TEAM_ANSWERING',
        isTimerRunning: false,
      };

    case 'SUBMIT_ANSWER': {
      const points = action.pointsOverride ?? state.scoreModifier;
      const { isCorrect } = action;

      let updatedTeams = [...state.teams];
      if (isCorrect && state.activeTeamId) {
        playCorrect();
        updatedTeams = updatedTeams.map(t =>
          t.id === state.activeTeamId ? { ...t, score: t.score + points } : t
        );
      } else {
        playWrong();
      }

      // Nếu ở vòng 2 và đúng: tự động reveal mảnh ghép của gợi ý đang chọn
      let updatedObstacle = { ...state.round2.obstacle };
      if (state.round === 2 && isCorrect && state.round2.activeClueId !== null) {
        updatedObstacle = {
          ...updatedObstacle,
          clues: updatedObstacle.clues.map(c =>
            c.id === state.round2.activeClueId ? { ...c, isRevealed: true } : c
          ),
        };
      }

      return {
        ...state,
        teams: updatedTeams,
        phase: 'RESULT_REVEAL',
        isTimerRunning: false,
        round1: {
          ...state.round1,
          lastResult: isCorrect ? 'CORRECT' : 'WRONG',
          lastPointsAwarded: isCorrect ? points : 0,
        },
        round2: {
          ...state.round2,
          obstacle: updatedObstacle,
          lastResult: isCorrect ? 'CORRECT' : 'WRONG',
          lastPointsAwarded: isCorrect ? points : 0,
        },
      };
    }

    case 'SKIP_QUESTION':
      return {
        ...state,
        phase: 'RESULT_REVEAL',
        isTimerRunning: false,
        activeTeamId: null,
        round1: {
          ...state.round1,
          lastResult: 'SKIPPED',
          lastPointsAwarded: 0,
        },
        round2: {
          ...state.round2,
          lastResult: 'SKIPPED',
          lastPointsAwarded: 0,
        },
      };

    case 'NEXT_QUESTION': {
      if (state.round === 1) {
        const nextIdx = Math.min(state.round1.currentQuestionIndex + 1, state.round1.questions.length - 1);
        const nextTime = state.round1.questions[nextIdx]?.timeLimit || 12;
        return {
          ...state,
          phase: 'IDLE',
          activeTeamId: null,
          isTimerRunning: false,
          timerSeconds: nextTime,
          scoreModifier: 10,
          round1: {
            ...state.round1,
            currentQuestionIndex: nextIdx,
            lastResult: null,
            lastPointsAwarded: 0,
          },
        };
      }
      return { ...state, phase: 'IDLE', activeTeamId: null, isTimerRunning: false };
    }

    case 'PREV_QUESTION': {
      if (state.round === 1) {
        const prevIdx = Math.max(state.round1.currentQuestionIndex - 1, 0);
        const prevTime = state.round1.questions[prevIdx]?.timeLimit || 12;
        return {
          ...state,
          phase: 'IDLE',
          activeTeamId: null,
          isTimerRunning: false,
          timerSeconds: prevTime,
          round1: {
            ...state.round1,
            currentQuestionIndex: prevIdx,
            lastResult: null,
            lastPointsAwarded: 0,
          },
        };
      }
      return state;
    }

    case 'TOGGLE_SCOREBOARD':
      return {
        ...state,
        phase: state.phase === 'SHOWING_SCOREBOARD' ? 'IDLE' : 'SHOWING_SCOREBOARD',
      };

    case 'UPDATE_TEAM_SCORE':
      return {
        ...state,
        teams: state.teams.map(t =>
          t.id === action.teamId ? { ...t, score: Math.max(0, t.score + action.delta) } : t
        ),
      };

    case 'SET_SCORE_MODIFIER':
      return {
        ...state,
        scoreModifier: action.points,
      };

    case 'UPDATE_TEAM_NAME':
      return {
        ...state,
        teams: state.teams.map(t =>
          t.id === action.teamId ? { ...t, name: action.name } : t
        ),
      };

    case 'ADD_TEAM': {
      const colors = ['#3B82F6', '#EAB308', '#EF4444', '#10B981', '#8B5CF6', '#EC4899'];
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: action.name || `Đội ${state.teams.length + 1}`,
        score: 0,
        canGuessObstacle: true,
        color: colors[state.teams.length % colors.length],
      };
      return { ...state, teams: [...state.teams, newTeam] };
    }

    case 'REMOVE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(t => t.id !== action.teamId),
      };

    // Round 2
    case 'SELECT_CLUE': {
      const clue = state.round2.obstacle.clues.find(c => c.id === action.clueId);
      return {
        ...state,
        phase: 'IDLE',
        activeTeamId: null,
        isTimerRunning: false,
        timerSeconds: clue?.timeLimit || 15,
        scoreModifier: 10,
        round2: {
          ...state.round2,
          activeClueId: action.clueId,
          lastResult: null,
          lastPointsAwarded: 0,
        },
      };
    }

    case 'REVEAL_CLUE_PIECE': {
      return {
        ...state,
        round2: {
          ...state.round2,
          obstacle: {
            ...state.round2.obstacle,
            clues: state.round2.obstacle.clues.map(c =>
              c.id === action.clueId ? { ...c, isRevealed: true } : c
            ),
          },
        },
      };
    }

    case 'START_OBSTACLE_GUESS':
      return {
        ...state,
        phase: 'OBSTACLE_GUESSING',
        activeTeamId: action.teamId,
        isTimerRunning: false,
        scoreModifier: 60, // Điểm thưởng lớn cho chướng ngại vật
      };

    case 'SUBMIT_OBSTACLE_GUESS': {
      const { isCorrect } = action;
      const points = action.pointsOverride ?? state.scoreModifier;

      if (isCorrect && state.activeTeamId) {
        playVictory();
        return {
          ...state,
          phase: 'RESULT_REVEAL',
          teams: state.teams.map(t =>
            t.id === state.activeTeamId ? { ...t, score: t.score + points } : t
          ),
          round2: {
            ...state.round2,
            obstacleSolvedBy: state.activeTeamId,
            obstacle: {
              ...state.round2.obstacle,
              isFullyRevealed: true,
              clues: state.round2.obstacle.clues.map(c => ({ ...c, isRevealed: true })),
            },
            lastResult: 'CORRECT',
            lastPointsAwarded: points,
          },
        };
      }

      // Đoán sai chướng ngại vật: Đội bị loại khỏi quyền đoán chướng ngại vật!
      playWrong();
      return {
        ...state,
        phase: 'RESULT_REVEAL',
        teams: state.teams.map(t =>
          t.id === state.activeTeamId ? { ...t, canGuessObstacle: false } : t
        ),
        round2: {
          ...state.round2,
          lastResult: 'WRONG',
          lastPointsAwarded: 0,
        },
      };
    }

    case 'REVEAL_FULL_OBSTACLE':
      playVictory();
      return {
        ...state,
        round2: {
          ...state.round2,
          obstacle: {
            ...state.round2.obstacle,
            isFullyRevealed: true,
            clues: state.round2.obstacle.clues.map(c => ({ ...c, isRevealed: true })),
          },
        },
      };

    case 'RESET_GAME':
      return INITIAL_STATE;

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, rawDispatch] = useReducer(gameReducer, INITIAL_STATE, (defaultState) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return defaultState;
  });

  const channelRef = useRef<BroadcastChannel | null>(null);
  const isSyncingFromChannelRef = useRef(false);
  const stateRef = useRef(state);

  // Setup BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const msg = event.data;
      if (msg?.type === 'OLYMPIA_STATE_UPDATE') {
        isSyncingFromChannelRef.current = true;
        rawDispatch({ type: 'SYNC_STATE', state: msg.payload });
        isSyncingFromChannelRef.current = false;
      } else if (msg?.type === 'OLYMPIA_REQUEST_SYNC') {
        // Send our current state to new clients
        channel.postMessage({
          type: 'OLYMPIA_STATE_UPDATE',
          payload: stateRef.current,
        });
      }
    };

    // Request sync from existing active tabs when opening
    channel.postMessage({ type: 'OLYMPIA_REQUEST_SYNC' });

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  // Broadcast state changes and persist to localStorage
  useEffect(() => {
    stateRef.current = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }

    if (!isSyncingFromChannelRef.current && channelRef.current) {
      channelRef.current.postMessage({
        type: 'OLYMPIA_STATE_UPDATE',
        payload: state,
      });
    }
  }, [state]);

  // Central Timer Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (state.isTimerRunning && state.timerSeconds > 0) {
      interval = setInterval(() => {
        rawDispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isTimerRunning, state.timerSeconds]);

  return (
    <GameContext.Provider value={{ state, dispatch: rawDispatch }}>
      {children}
    </GameContext.Provider>
  );
};
