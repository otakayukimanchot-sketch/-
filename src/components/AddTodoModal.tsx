import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { Category, Priority, TodoItem, CATEGORY_INFO, PRIORITY_INFO } from '../types';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; category: Category; priority: Priority; id?: string }) => void;
  initialCategory?: Category;
  editingItem?: TodoItem | null;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory = 'todo',
  editingItem = null,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(initialCategory);
  const [priority, setPriority] = useState<Priority>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setPriority(editingItem.priority);
    } else {
      setTitle('');
      setCategory(initialCategory);
      setPriority('medium');
    }
  }, [editingItem, initialCategory, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      category,
      priority,
      id: editingItem?.id,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
          {/* Backdrop: simple flat semi-opaque screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />

          {/* Dialog Container: Flat minimal Apple / Stripe style panel */}
          <motion.div
            initial={{ y: '100%', opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full sm:max-w-xl bg-[var(--bg-primary)] border-t sm:border border-[var(--line-border)] p-6 sm:p-8 flex flex-col z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line-border)]">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                  {editingItem ? '項目を編集' : '新しい項目を追加'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  内容、カテゴリー、重要度を設定します
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* ① 内容 */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] tracking-wider uppercase">
                  内容
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={category === 'todo' ? '例：プレゼン資料を作る' : '例：牛乳、卵、ティッシュ'}
                  maxLength={120}
                  className="w-full px-0 py-3 bg-transparent border-b border-[var(--line-border)] focus:border-[var(--text-primary)] text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-colors"
                />
              </div>

              {/* ② カテゴリー (Flat text switcher) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] tracking-wider uppercase">
                  カテゴリー
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['todo', 'shopping'] as Category[]).map((catKey) => {
                    const isSelected = category === catKey;
                    const info = CATEGORY_INFO[catKey];
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setCategory(catKey)}
                        className={`flex flex-col items-start p-3.5 border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[var(--text-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium'
                            : 'border-[var(--line-border)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-semibold">{info.title}</span>
                          {isSelected && <Check size={14} strokeWidth={2.5} />}
                        </div>
                        <span className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-1">
                          {info.shortDesc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ③ 重要度 (Flat 3-column selector) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] tracking-wider uppercase">
                    重要度
                  </label>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    リストの並び順に反映
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['urgent', 'medium', 'later'] as Priority[]).map((pKey) => {
                    const isSelected = priority === pKey;
                    const pInfo = PRIORITY_INFO[pKey];

                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setPriority(pKey)}
                        className={`py-3 px-2 border text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? pKey === 'urgent'
                              ? 'border-[var(--accent-urgent)] bg-[var(--bg-secondary)] text-[var(--accent-urgent)] font-semibold'
                              : 'border-[var(--text-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold'
                            : 'border-[var(--line-border)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]'
                        }`}
                      >
                        <span className="text-sm">
                          {pInfo.label}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)]">
                          {pKey === 'urgent' ? '緊急' : pKey === 'medium' ? '近いうち' : '後で'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--line-border)]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-opacity cursor-pointer"
                >
                  {editingItem ? '更新する' : '追加する'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
