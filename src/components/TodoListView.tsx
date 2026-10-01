import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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

    // 1. Priority: urgent -> medium -> later
    // 2. Added order: createdAt ascending
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

    completed.sort((a, b) => {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return timeB - timeA;
    });

    return { activeItems: active, completedItems: completed };
  }, [categoryItems]);

  return (
    <div className="w-full space-y-8">
      {/* Category Section Header: Flat editorial typography */}
      <section className="pt-2 pb-4 border-b border-[var(--line-border)] flex items-end justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {info.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {info.subtitle}
          </p>
        </div>

        <div className="text-right text-xs text-[var(--text-secondary)] font-mono">
          <span>未完了 {activeItems.length} 件</span>
          {completedItems.length > 0 && (
            <span> · 完了 {completedItems.length} 件</span>
          )}
        </div>
      </section>

      {/* Active Items: Direct flat full-width list */}
      <section className="w-full">
        {activeItems.length > 0 ? (
          <div className="w-full divide-y divide-[var(--line-subtle)] border-t border-[var(--line-subtle)]">
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
          <div className="py-16 text-center space-y-4">
            <p className="text-base font-normal text-[var(--text-secondary)]">
              現在、登録されている項目はありません
            </p>
            <button
              type="button"
              onClick={() => onOpenAdd(category)}
              className="text-sm font-medium text-[var(--text-primary)] underline underline-offset-4 hover:opacity-75 transition-opacity cursor-pointer"
            >
              ＋ 新しい項目を追加する
            </button>
          </div>
        )}
      </section>

      {/* Completed Items Section: Flat typography divider */}
      {completedItems.length > 0 && (
        <section className="w-full pt-8 mt-12 border-t border-[var(--line-border)] space-y-4">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span>完了済み ({completedItems.length})</span>
              {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('完了済みの項目をすべて削除してもよろしいですか？')) {
                  onClearCompleted(category);
                }
              }}
              className="text-xs text-[var(--text-tertiary)] hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>完了を消去</span>
            </button>
          </div>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full divide-y divide-[var(--line-subtle)] border-t border-[var(--line-subtle)] opacity-70"
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

      {/* Floating Action Button: Clean flat circular button without drop shadow */}
      <button
        type="button"
        onClick={() => onOpenAdd(category)}
        aria-label="新しい項目を追加"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--line-border)] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40 cursor-pointer"
        style={{ borderRadius: '9999px' }}
      >
        <Plus size={24} strokeWidth={2} />
      </button>
    </div>
  );
};
