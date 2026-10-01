import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X, Sun, Moon, Monitor, Trash2, HelpCircle, Share2, AlertTriangle, BookOpen } from 'lucide-react';
import { ThemeMode } from '../types';

interface MenuProps {
  themeMode: ThemeMode;
  onChangeThemeMode: (mode: ThemeMode) => void;
  onClearAll: () => void;
  onShowTutorial: () => void;
  onShowShare: () => void;
  onShowNotes: () => void;
}

export const Menu: React.FC<MenuProps> = ({
  themeMode,
  onChangeThemeMode,
  onClearAll,
  onShowTutorial,
  onShowShare,
  onShowNotes,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="メニューを開く"
        className="w-10 h-10 rounded-xl bg-[var(--canvas-surface)] border border-[var(--canvas-line)] flex items-center justify-center text-[var(--ink-primary)] hover:border-[var(--ink-muted)] transition-colors cursor-pointer shadow-xs"
        id="menu-btn"
      >
        <MenuIcon size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative w-80 max-w-[85vw] h-full bg-[var(--canvas-surface)] border-l border-[var(--canvas-line)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--canvas-line)]">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-[var(--ink-primary)]" />
                    <span className="font-bold text-base text-[var(--ink-primary)]">設定・メニュー</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="閉じる"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:bg-[var(--canvas-line-subtle)] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Theme Selector */}
                <div className="mt-6 space-y-2">
                  <label className="text-xs font-bold text-[var(--ink-muted)] tracking-wider">
                    表示テーマ
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--canvas-bg)] rounded-xl border border-[var(--canvas-line)]">
                    <button
                      type="button"
                      onClick={() => onChangeThemeMode('light')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                        themeMode === 'light'
                          ? 'bg-[var(--canvas-surface)] text-[var(--ink-primary)] shadow-xs'
                          : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                      }`}
                    >
                      <Sun size={16} className="mb-1" />
                      <span>ライト</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeThemeMode('dark')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                        themeMode === 'dark'
                          ? 'bg-[var(--canvas-surface)] text-[var(--ink-primary)] shadow-xs'
                          : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                      }`}
                    >
                      <Moon size={16} className="mb-1" />
                      <span>ダーク</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeThemeMode('system')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                        themeMode === 'system'
                          ? 'bg-[var(--canvas-surface)] text-[var(--ink-primary)] shadow-xs'
                          : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                      }`}
                    >
                      <Monitor size={16} className="mb-1" />
                      <span>端末連動</span>
                    </button>
                  </div>
                </div>

                {/* Navigation links */}
                <div className="mt-6 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onShowTutorial();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--canvas-line-subtle)] text-[var(--ink-primary)] text-sm font-medium transition-colors text-left"
                  >
                    <HelpCircle size={18} className="text-[var(--ink-muted)]" />
                    <span>使い方ガイド</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowNotes();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--canvas-line-subtle)] text-[var(--ink-primary)] text-sm font-medium transition-colors text-left"
                  >
                    <AlertTriangle size={18} className="text-[var(--ink-muted)]" />
                    <span>ご利用上の注意点</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowShare();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--canvas-line-subtle)] text-[var(--ink-primary)] text-sm font-medium transition-colors text-left"
                  >
                    <Share2 size={18} className="text-[var(--ink-muted)]" />
                    <span>アプリを共有する</span>
                  </button>
                </div>
              </div>

              {/* Bottom danger action & footer */}
              <div className="pt-6 border-t border-[var(--canvas-line)] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('すべてのTodo項目を削除してもよろしいですか？この操作は取り消せません。')) {
                      onClearAll();
                      setIsOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold transition-colors"
                >
                  <Trash2 size={16} />
                  <span>すべてのデータを削除</span>
                </button>

                <p className="text-[11px] text-center text-[var(--ink-faint)]">
                  ふきメモ · キャンバスノートTodo
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
