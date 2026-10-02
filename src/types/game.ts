export type Team = {
  id: string;
  name: string;
  score: number;
  canGuessObstacle: boolean;
  color: string; // e.g. '#3B82F6', '#EAB308', '#EF4444', '#10B981'
};

export type Round1Question = {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  correctOptionIndex?: number;
  timeLimit: number; // in seconds, e.g. 10 or 15
  explanation?: string; // Dẫn chứng giáo trình & ghi chú thuyết minh cho MC/Host
};

export type ObstacleClue = {
  id: number;
  rowLabel: string; // e.g. "Hàng ngang 1"
  question: string;
  answer: string;
  isRevealed: boolean;
  timeLimit: number;
  explanation?: string; // Ý nghĩa / ghi chú thuyết minh cho MC/Host
};

export type ObstacleData = {
  keyword: string; // Tên chướng ngại vật (bí mật)
  description: string;
  imageUrl: string; // Hình ảnh lớn ở trung tâm
  clues: ObstacleClue[];
  isFullyRevealed: boolean;
};

export type GamePhase =
  | 'IDLE'                 // Sẵn sàng trước khi mở câu hỏi
  | 'QUESTION_ACTIVE'     // Đang đọc câu hỏi & đếm giờ
  | 'TEAM_ANSWERING'      // Host đã chọn đội giơ tay, đội đang phát biểu
  | 'RESULT_REVEAL'       // Vừa bấm Đúng/Sai, đang hiển thị kết quả
  | 'SHOWING_SCOREBOARD'  // Đang phóng to bảng xếp hạng trên Presentation
  | 'OBSTACLE_GUESSING';  // Đang trong trạng thái có đội xin đoán chướng ngại vật

export type GameState = {
  round: 0 | 1 | 2 | 3;
  phase: GamePhase;
  isStandby: boolean; // Trạng thái màn hình chờ (true: hiện màn hình tên vòng thi, false: vào giao diện thi đấu)
  teams: Team[];
  activeTeamId: string | null;
  timerSeconds: number;
  isTimerRunning: boolean;
  scoreModifier: number; // Điểm sẽ cộng nếu chọn ĐÚNG (mặc định 10)
  
  // Vòng 1
  round1: {
    currentQuestionIndex: number; // 0..9
    questions: Round1Question[];
    selectedOptionIndex: number | null;
    lastResult: 'CORRECT' | 'WRONG' | 'TIMEOUT' | 'SKIPPED' | null;
    lastPointsAwarded: number;
    nextQuestionTrigger?: number; // timestamp to trigger new question sfx
  };

  // Vòng 2
  round2: {
    obstacle: ObstacleData;
    activeClueId: number | null; // 1..6
    obstacleSolvedBy: string | null; // team id nếu đã giải được
    lastResult: 'CORRECT' | 'WRONG' | 'TIMEOUT' | 'SKIPPED' | null;
    lastPointsAwarded: number;
    cueCorrectTrigger?: number; // timestamp to trigger solved fanfare & bed
    clueRevealTrigger?: number; // timestamp to trigger clue reveal sound
    isQuestionVisible?: boolean; // cờ ẩn/hiện card câu hỏi trên màn hình chiếu
    chooseRowTrigger?: number; // timestamp to trigger choose row sound
    obstacleSolvedTrigger?: number; // timestamp to trigger obstacle keyword solved sound
  };

  // Màn hình tổng kết điểm & trao giải (Round 3)
  summary: {
    revealStep: number; // 0: Sẵn sàng, 1: Top 3, 2: Top 2, 3: Top 1, 4: Top 4-6
    isCreditsPlaying: boolean;
    confettiTrigger?: number;
  };
};

export type GameAction =
  | { type: 'SET_ROUND'; round: 0 | 1 | 2 | 3 }
  | { type: 'SET_STANDBY'; isStandby: boolean }
  | { type: 'START_QUESTION' }
  | { type: 'BEGIN_COUNTDOWN' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'RESET_TIMER'; seconds: number }
  | { type: 'TICK_TIMER' }
  | { type: 'CHOOSE_OPTION'; optionIndex: number }
  | { type: 'SELECT_TEAM_FOR_ANSWER'; teamId: string }
  | { type: 'SUBMIT_ANSWER'; isCorrect: boolean; pointsOverride?: number }
  | { type: 'SKIP_QUESTION' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'TOGGLE_SCOREBOARD' }
  | { type: 'UPDATE_TEAM_SCORE'; teamId: string; delta: number }
  | { type: 'SET_SCORE_MODIFIER'; points: number }
  | { type: 'UPDATE_TEAM_NAME'; teamId: string; name: string }
  | { type: 'ADD_TEAM'; name: string }
  | { type: 'REMOVE_TEAM'; teamId: string }
  // Round 2 specific
  | { type: 'SELECT_CLUE'; clueId: number }
  | { type: 'UNSELECT_CLUE' }
  | { type: 'TOGGLE_CLUE_QUESTION' }
  | { type: 'REVEAL_CLUE_PIECE'; clueId: number }
  | { type: 'CUE_CORRECT_ANSWER'; clueId: number }
  | { type: 'START_OBSTACLE_GUESS'; teamId: string }
  | { type: 'SUBMIT_OBSTACLE_GUESS'; isCorrect: boolean; pointsOverride?: number }
  | { type: 'REVEAL_FULL_OBSTACLE' }
  // Round 3 / Summary specific
  | { type: 'SET_SUMMARY_STEP'; step: number }
  | { type: 'NEXT_SUMMARY_STEP' }
  | { type: 'PREV_SUMMARY_STEP' }
  | { type: 'RESET_SUMMARY_STEP' }
  | { type: 'TRIGGER_SUMMARY_CONFETTI' }
  | { type: 'TOGGLE_CREDITS_MUSIC'; isPlaying?: boolean }
  | { type: 'RESET_GAME' }
  | { type: 'SYNC_STATE'; state: GameState };
