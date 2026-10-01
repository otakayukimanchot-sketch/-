import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckCircle2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Priority, TodoItem, CATEGORY_INFO } from '../types';
import { TodoItemRow } from './TodoItemRow';

interface TodoListViewProps {
  category: Category;
  items: TodoItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: TodoItem) => void;
  onOpenAdd: (category: Category) => void;
  onClearCompleted: (category: Category) => void;
  onMoveCategory: (id: string, newCategory: Category) => void;
}

export const TodoListView: React.FC<TodoListViewProps> = ({
  category,
  items,
  onToggleComplete,
  onDelete,
  onEdit,
  onOpenAdd,
  onClearCompleted,
  onMoveCategory,
}) => {
  const [showCompleted, setShowCompleted] = useState(true);
  const info = CATEGORY_INFO[category];

  // Filter items belonging to this category
  const categoryItems = useMemo(() => {
    return items.filter((item) => item.category === category);
  }, [items, category]);

  // Separate active and completed
  const { activeItems, completedItems } = useMemo(() => {
    const active = categoryItems.filter((item) => !item.completed);
    const completed = categoryItems.filter((item) => item.completed);

    // Sort active items:
    // 1. Priority: urgent (やばめ) -> medium (そこそこ) -> later (後で)
    // 2. Tie breaker: createdAt ascending (added order maintained)
    const priorityWeight: Record<Priority, number> = {
      urgent: 1,
      medium: 2,
      later: 3,
    };

    active.sort((a, b) => {
      const pDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    // Completed items: most recently completed first
    completed.sort((a, b) => {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return timeB - timeA;
    });

    return { activeItems: active, completedItems: completed };
  }, [categoryItems]);

  return (
    <div className="w-full space-y-6">
      {/* Category Header Description & Count Bar */}
      <div className="flex items-baseline justify-between flex-wrap gap-2 pt-2 pb-3 border-b border-[var(--canvas-line)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
            {info.title}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            {info.subtitle}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--ink-muted)]">
            未完了 <strong className="text-[var(--ink-primary)] font-bold tabular-nums">{activeItems.length}</strong> 件
            {completedItems.length > 0 && (
              <>
                <span className="mx-1.5 opacity-40">·</span>
                完了 <span className="tabular-nums font-medium">{completedItems.length}</span> 件
              </>
            )}
          </span>
        </div>
      </div>

      {/* Active Items List: Clean Notebook Canvas feel with generous spacing */}
      <section className="space-y-1">
        {activeItems.length > 0 ? (
          <div className="canvas-card rounded-2xl p-2 sm:p-3 divide-y divide-[var(--canvas-line-subtle)]">
            <AnimatePresence initial={false}>
              {activeItems.map((item) => (
                <TodoItemRow
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onMoveCategory={onMoveCategory}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="canvas-card rounded-2xl p-8 sm:p-12 text-center text-[var(--ink-muted)] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--canvas-line-subtle)] flex items-center justify-center mx-auto text-[var(--ink-faint)]">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-base font-medium text-[var(--ink-primary)]">
              項目はありません
            </p>
            <p className="text-xs max-w-xs mx-auto leading-relaxed">
              右下の「＋」ボタンを押して、新しい項目をノートに書き込みましょう。
            </p>
            <button
              type="button"
              onClick={() => onOpenAdd(category)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--ink-primary)] text-[var(--canvas-bg)] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>新しい項目を追加</span>
            </button>
          </div>
        )}
      </section>

      {/* Completed Items Section: Separated by clear subtle divider line */}
      {completedItems.length > 0 && (
        <section className="pt-4 border-t border-[var(--canvas-line)]">
          <div className="flex items-center justify-between py-2 mb-2">
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition-colors cursor-pointer"
            >
              <span>完了済み ({completedItems.length})</span>
              {showCompleted ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('完了済みの項目をすべて削除してもよろしいですか？')) {
                  onClearCompleted(category);
                }
              }}
              className="text-[11px] text-[var(--ink-faint)] hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} />
              <span>完了を消去</span>
            </button>
          </div>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="canvas-card rounded-2xl p-2 sm:p-3 divide-y divide-[var(--canvas-line-subtle)] opacity-85"
              >
                {completedItems.map((item) => (
                  <TodoItemRow
                    key={item.id}
                    item={item}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onMoveCategory={onMoveCategory}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Floating Action Button (FAB) for adding new items */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => onOpenAdd(category)}
        aria-label="新しい項目を追加"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--ink-primary)] text-[var(--canvas-bg)] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-30 cursor-pointer"
      >
        <Plus size={28} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};
