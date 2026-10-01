import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Trash2, Edit3, MoreHorizontal, ArrowRightLeft } from 'lucide-react';
import { TodoItem, PRIORITY_INFO, Category } from '../types';

interface TodoItemRowProps {
  item: TodoItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: TodoItem) => void;
  onMoveCategory?: (id: string, newCategory: Category) => void;
}

export const TodoItemRow: React.FC<TodoItemRowProps> = ({
  item,
  onToggleComplete,
  onDelete,
  onEdit,
  onMoveCategory,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getPriorityMarker = () => {
    if (item.completed) return null;
    switch (item.priority) {
      case 'urgent':
        return (
          <span className="text-xs font-semibold text-[var(--accent-urgent)] flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-urgent)]" />
            やばめ
          </span>
        );
      case 'medium':
        return (
          <span className="text-xs font-normal text-[var(--text-secondary)] flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] opacity-60" />
            そこそこ
          </span>
        );
      case 'later':
      default:
        return (
          <span className="text-xs font-normal text-[var(--text-tertiary)] flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full border border-[var(--text-tertiary)] bg-transparent" />
            後で
          </span>
        );
    }
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`group w-full flex items-start justify-between py-4 border-b border-[var(--line-subtle)] transition-colors ${
        item.completed 
          ? 'text-[var(--text-tertiary)]' 
          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50'
      }`}
    >
      {/* Left: Flat Minimal Checkbox & Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-3">
        {/* Touch Target (>= 44px) */}
        <button
          type="button"
          onClick={() => onToggleComplete(item.id)}
          aria-label={item.completed ? '未完了に戻す' : '完了にする'}
          className="w-10 h-10 -ml-2 -mt-2 flex items-center justify-center shrink-0 cursor-pointer text-[var(--text-primary)]"
        >
          <div
            className={`w-4.5 h-4.5 rounded-sm flex items-center justify-center transition-all ${
              item.completed
                ? 'bg-[var(--text-secondary)] text-[var(--bg-primary)]'
                : 'border border-[var(--line-border)] hover:border-[var(--text-primary)] bg-transparent'
            }`}
          >
            {item.completed && <Check size={12} strokeWidth={3} />}
          </div>
        </button>

        {/* Text Details */}
        <div 
          onClick={() => onToggleComplete(item.id)}
          className="flex-1 min-w-0 cursor-pointer select-none space-y-1"
        >
          <div className="flex items-center gap-2.5">
            {getPriorityMarker()}
            {item.completed && item.completedAt && (
              <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                {new Date(item.completedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 完了
              </span>
            )}
          </div>

          <p
            className={`text-[15px] sm:text-[16px] leading-relaxed break-words font-normal tracking-tight transition-all ${
              item.completed
                ? 'line-through text-[var(--text-tertiary)] font-light'
                : item.priority === 'urgent'
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {item.title}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0 pt-0.5">
        <button
          type="button"
          onClick={() => onEdit(item)}
          aria-label="編集"
          title="編集"
          className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          aria-label="削除"
          title="削除"
          className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 transition-colors opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 size={15} />
        </button>

        {onMoveCategory && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              aria-label="その他"
              className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors sm:hidden"
            >
              <MoreHorizontal size={15} />
            </button>

            {showOptions && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowOptions(false)} 
                />
                <div className="absolute right-0 top-9 z-30 w-36 bg-[var(--bg-primary)] border border-[var(--line-border)] py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptions(false);
                      onMoveCategory(item.id, item.category === 'todo' ? 'shopping' : 'todo');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  >
                    <ArrowRightLeft size={13} />
                    <span>{item.category === 'todo' ? '買うものへ移動' : 'やることへ移動'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptions(false);
                      onDelete(item.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--bg-secondary)] text-red-500"
                  >
                    <Trash2 size={13} />
                    <span>削除する</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
