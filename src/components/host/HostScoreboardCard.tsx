import React, { useState } from 'react';
import type { Team } from '../../types/game';
import { useGame } from '../../context/useGame';
import { Plus, Minus, Edit2, Check, ShieldAlert } from 'lucide-react';

interface HostScoreboardCardProps {
  team: Team;
  isSelectedForAnswer: boolean;
  onSelectAnswer: () => void;
  disabled?: boolean;
}

export const HostScoreboardCard: React.FC<HostScoreboardCardProps> = ({
  team,
  isSelectedForAnswer,
  onSelectAnswer,
  disabled,
}) => {
  const { dispatch, state } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(team.name);

  const handleSaveName = () => {
    if (editName.trim()) {
      dispatch({ type: 'UPDATE_TEAM_NAME', teamId: team.id, name: editName.trim() });
    }
    setIsEditingName(false);
  };

  const handleAddScore = (e: React.MouseEvent, amount: number) => {
    e.stopPropagation();
    dispatch({ type: 'UPDATE_TEAM_SCORE', teamId: team.id, delta: amount });
  };

  return (
    <div
      onClick={() => {
        if (!disabled && state.phase === 'QUESTION_ACTIVE') {
          onSelectAnswer();
        }
      }}
      className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isSelectedForAnswer
          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
          : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: team.color }}
          />
          {isEditingName ? (
            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="bg-slate-950 border border-slate-600 rounded px-2 py-0.5 text-xs text-white w-full outline-none focus:border-amber-400"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1 hover:text-emerald-400 text-slate-300"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-sm truncate text-slate-200">
                {team.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                className="opacity-0 hover:opacity-100 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-200 transition-opacity"
                title="Sửa tên đội"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Điểm số */}
        <div className="text-right">
          <div className="font-display font-extrabold text-xl text-amber-400 tracking-tight">
            {team.score}
            <span className="text-xs font-normal text-slate-400 ml-0.5">đ</span>
          </div>
        </div>
      </div>

      {/* Trạng thái vòng 2: Khóa quyền đoán CNV */}
      {state.round === 2 && !team.canGuessObstacle && (
        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
          <ShieldAlert className="w-3 h-3 shrink-0" />
          <span>Bị khóa đoán CNV</span>
        </div>
      )}

      {/* Nút thao tác nhanh điểm: +/- */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => handleAddScore(e, -10)}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
            title="Trừ 10 điểm"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => handleAddScore(e, 5)}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
            title="Cộng 5 điểm"
          >
            +5
          </button>
          <button
            onClick={(e) => handleAddScore(e, 10)}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
            title="Cộng 10 điểm"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Nút Chọn giơ tay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectAnswer();
          }}
          disabled={disabled}
          className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
            isSelectedForAnswer
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
              : 'bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700'
          }`}
        >
          {isSelectedForAnswer ? 'Đang trả lời' : 'Chọn trả lời'}
        </button>
      </div>
    </div>
  );
};
