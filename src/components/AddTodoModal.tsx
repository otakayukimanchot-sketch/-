import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertCircle, Clock, Calendar } from 'lucide-react';
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
      }, 80);
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
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full sm:max-w-lg bg-[var(--canvas-surface)] border-t sm:border border-[var(--canvas-line)] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Grab handle for mobile */}
            <div className="w-10 h-1 bg-[var(--canvas-line)] rounded-full mx-auto mb-4 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--canvas-line)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--ink-primary)]">
                  {editingItem ? '項目を編集' : 'ノートに書き込む'}
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                  内容・カテゴリー・重要度を入力
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:bg-[var(--canvas-line-subtle)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              {/* ① 内容 (Title) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ink-muted)] tracking-wider">
                  内容 <span className="text-[var(--accent-urgent)]">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={category === 'todo' ? '例：プレゼン資料を作る' : '例：牛乳、卵、ティッシュ'}
                    maxLength={120}
                    className="w-full px-4 py-3.5 bg-[var(--canvas-bg)] border border-[var(--canvas-line)] rounded-xl text-[16px] text-[var(--ink-primary)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--ink-primary)] transition-colors"
                  />
                </div>
              </div>

              {/* ② カテゴリー (Category) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--ink-muted)] tracking-wider">
                  カテゴリー
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['todo', 'shopping'] as Category[]).map((catKey) => {
                    const isSelected = category === catKey;
                    const info = CATEGORY_INFO[catKey];
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setCategory(catKey)}
                        className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--canvas-bg)] shadow-sm'
                            : 'border-[var(--canvas-line)] bg-[var(--canvas-bg)] text-[var(--ink-primary)] hover:border-[var(--ink-muted)]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[15px] font-bold">
                            {info.title}
                          </span>
                          {isSelected && <Check size={16} strokeWidth={2.5} />}
                        </div>
                        <span className={`text-[11px] mt-1 line-clamp-1 ${
                          isSelected ? 'text-[var(--canvas-bg)]/80' : 'text-[var(--ink-muted)]'
                        }`}>
                          {info.shortDesc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ③ 重要度 (Priority) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--ink-muted)] tracking-wider">
                    重要度
                  </label>
                  <span className="text-[11px] text-[var(--ink-faint)]">
                    リストの並び順に反映されます
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['urgent', 'medium', 'later'] as Priority[]).map((pKey) => {
                    const isSelected = priority === pKey;
                    const pInfo = PRIORITY_INFO[pKey];

                    let activeBorder = 'border-[var(--ink-primary)]';
                    let accentDotColor = 'bg-[var(--ink-primary)]';
                    if (pKey === 'urgent') {
                      activeBorder = 'border-[var(--accent-urgent)]';
                      accentDotColor = 'bg-[var(--accent-urgent)]';
                    }

                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setPriority(pKey)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? `${activeBorder} bg-[var(--canvas-bg)] shadow-sm ring-1 ring-inset ${
                                pKey === 'urgent' ? 'ring-[var(--accent-urgent)]' : 'ring-[var(--ink-primary)]'
                              }`
                            : 'border-[var(--canvas-line)] bg-[var(--canvas-bg)] hover:border-[var(--ink-muted)] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              pKey === 'urgent'
                                ? 'bg-[var(--accent-urgent)]'
                                : pKey === 'medium'
                                ? 'bg-[var(--ink-primary)]'
                                : 'border border-[var(--ink-muted)] bg-transparent'
                            }`}
                          />
                          <span className={`text-[14px] font-bold ${
                            isSelected && pKey === 'urgent' ? 'text-[var(--accent-urgent)]' : 'text-[var(--ink-primary)]'
                          }`}>
                            {pInfo.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--ink-muted)] leading-tight">
                          {pKey === 'urgent' ? '緊急・優先' : pKey === 'medium' ? '近いうちに' : '空き時間に'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3.5 px-4 rounded-xl border border-[var(--canvas-line)] text-sm font-medium text-[var(--ink-muted)] hover:bg-[var(--canvas-line-subtle)] transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="w-2/3 py-3.5 px-4 rounded-xl bg-[var(--ink-primary)] text-[var(--canvas-bg)] text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                >
                  <span>{editingItem ? '更新する' : 'ノートに追加'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
