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
  const priorityMeta = PRIORITY_INFO[item.priority];

  // Visual cues based on priority
  const renderPriorityBullet = () => {
    if (item.completed) {
      return (
        <span className="w-2 h-2 rounded-full bg-[var(--ink-faint)] shrink-0 inline-block opacity-60" />
      );
    }

    switch (item.priority) {
      case 'urgent':
        return (
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[var(--accent-urgent)] shrink-0 inline-block ring-2 ring-[var(--accent-urgent)]/20"
            title="やばめ" 
          />
        );
      case 'medium':
        return (
          <span 
            className="w-2 h-2 rounded-full bg-[var(--ink-primary)] shrink-0 inline-block opacity-80"
            title="そこそこ" 
          />
        );
      case 'later':
      default:
        return (
          <span 
            className="w-2 h-2 rounded-full border border-[var(--ink-muted)] shrink-0 inline-block bg-transparent"
            title="後で" 
          />
        );
    }
  };

  const getPriorityBadge = () => {
    if (item.completed) return null;
    switch (item.priority) {
      case 'urgent':
        return (
          <span className="text-[11px] font-medium tracking-tight text-[var(--accent-urgent)]">
            やばめ
          </span>
        );
      case 'medium':
        return (
          <span className="text-[11px] font-medium tracking-tight text-[var(--ink-muted)]">
            そこそこ
          </span>
        );
      case 'later':
        return (
          <span className="text-[11px] font-normal tracking-tight text-[var(--ink-faint)]">
            後で
          </span>
        );
    }
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`group relative flex items-start justify-between py-3.5 px-3 rounded-xl transition-colors border-b border-[var(--canvas-line-subtle)] ${
        item.completed 
          ? 'bg-transparent text-[var(--ink-faint)]' 
          : 'hover:bg-[var(--canvas-surface)]'
      }`}
    >
      {/* Left: Checkbox & Bullet & Title */}
      <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
        {/* Checkbox Touch Target (>= 44px) */}
        <button
          type="button"
          onClick={() => onToggleComplete(item.id)}
          aria-label={item.completed ? '未完了に戻す' : '完了にする'}
          className="w-10 h-10 -ml-2 -mt-1 flex items-center justify-center shrink-0 cursor-pointer rounded-lg hover:bg-[var(--canvas-line-subtle)] transition-colors"
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              item.completed
                ? 'bg-[var(--ink-muted)] text-[var(--canvas-surface)] border border-[var(--ink-muted)]'
                : 'border-2 border-[var(--ink-faint)] hover:border-[var(--ink-primary)] bg-[var(--canvas-surface)]'
            }`}
          >
            {item.completed && <Check size={13} strokeWidth={3} />}
          </div>
        </button>

        {/* Content Area */}
        <div 
          onClick={() => onToggleComplete(item.id)}
          className="flex-1 min-w-0 pt-0.5 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            {renderPriorityBullet()}
            {getPriorityBadge()}
            {item.completed && item.completedAt && (
              <span className="text-[11px] text-[var(--ink-faint)] font-mono">
                {new Date(item.completedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 完了
              </span>
            )}
          </div>

          <p
            className={`text-[15px] sm:text-[16px] leading-relaxed break-words font-normal transition-all ${
              item.completed
                ? 'line-through text-[var(--ink-faint)] font-light'
                : item.priority === 'urgent'
                ? 'text-[var(--ink-primary)] font-medium'
                : 'text-[var(--ink-primary)]'
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
          className="w-8 h-8 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink-primary)] rounded-lg hover:bg-[var(--canvas-line-subtle)] transition-colors opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          aria-label="削除"
          title="削除"
          className="w-8 h-8 flex items-center justify-center text-[var(--ink-faint)] hover:text-red-500 rounded-lg hover:bg-[var(--canvas-line-subtle)] transition-colors opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 size={15} />
        </button>

        {/* Mobile menu trigger if on small screens */}
        {onMoveCategory && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              aria-label="その他"
              className="w-8 h-8 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink-primary)] rounded-lg hover:bg-[var(--canvas-line-subtle)] transition-colors sm:hidden"
            >
              <MoreHorizontal size={15} />
            </button>

            {showOptions && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowOptions(false)} 
                />
                <div className="absolute right-0 top-9 z-30 w-36 bg-[var(--canvas-surface)] border border-[var(--canvas-line)] rounded-xl shadow-lg p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptions(false);
                      onMoveCategory(item.id, item.category === 'todo' ? 'shopping' : 'todo');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-[var(--canvas-line-subtle)] text-[var(--ink-primary)]"
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
                    className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
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
