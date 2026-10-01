import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X, Sun, Moon, Monitor, Trash2, HelpCircle, Share2, AlertTriangle } from 'lucide-react';
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
        aria-label="メニュー"
        className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        id="menu-btn"
      >
        <MenuIcon size={20} strokeWidth={1.75} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="relative w-80 max-w-[85vw] h-full bg-[var(--bg-primary)] border-l border-[var(--line-border)] p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--line-border)]">
                  <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">
                    メニュー
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="閉じる"
                    className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Theme Selector: Flat segmented buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] tracking-wider uppercase">
                    外観モード
                  </label>
                  <div className="grid grid-cols-3 border border-[var(--line-border)] divide-x divide-[var(--line-border)]">
                    <button
                      type="button"
                      onClick={() => onChangeThemeMode('light')}
                      className={`flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Sun size={15} className="mb-1" />
                      <span>ライト</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeThemeMode('dark')}
                      className={`flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        themeMode === 'dark'
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Moon size={15} className="mb-1" />
                      <span>ダーク</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeThemeMode('system')}
                      className={`flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        themeMode === 'system'
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Monitor size={15} className="mb-1" />
                      <span>自動</span>
                    </button>
                  </div>
                </div>

                {/* Navigation links */}
                <div className="space-y-1 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onShowTutorial();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-3 border-b border-[var(--line-subtle)] text-[var(--text-primary)] text-sm font-medium hover:text-[var(--text-secondary)] transition-colors text-left cursor-pointer"
                  >
                    <HelpCircle size={16} className="text-[var(--text-secondary)]" />
                    <span>使い方ガイド</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowNotes();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-3 border-b border-[var(--line-subtle)] text-[var(--text-primary)] text-sm font-medium hover:text-[var(--text-secondary)] transition-colors text-left cursor-pointer"
                  >
                    <AlertTriangle size={16} className="text-[var(--text-secondary)]" />
                    <span>ご利用上の注意点</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowShare();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-3 border-b border-[var(--line-subtle)] text-[var(--text-primary)] text-sm font-medium hover:text-[var(--text-secondary)] transition-colors text-left cursor-pointer"
                  >
                    <Share2 size={16} className="text-[var(--text-secondary)]" />
                    <span>共有する</span>
                  </button>
                </div>
              </div>

              {/* Bottom reset action */}
              <div className="pt-6 border-t border-[var(--line-border)] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('すべての項目を削除してもよろしいですか？この操作は取り消せません。')) {
                      onClearAll();
                      setIsOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-500 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>すべてのデータを削除</span>
                </button>

                <p className="text-[11px] text-center text-[var(--text-tertiary)]">
                  ふきメモ
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
