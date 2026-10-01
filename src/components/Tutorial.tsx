import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, ShoppingBag, AlertCircle, ArrowDownAZ } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            className="relative w-full max-w-lg bg-[var(--canvas-surface)] border border-[var(--canvas-line)] p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="absolute top-4 right-4 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:bg-[var(--canvas-line-subtle)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--ink-muted)]">
                HOW TO USE
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)] mt-1">
                ふきメモの使い方
              </h2>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                白いキャンバスノートに書き込むような、温かみのあるTodoアプリです。
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 text-xs sm:text-sm text-[var(--ink-primary)]">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[var(--canvas-bg)] border border-[var(--canvas-line-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[var(--ink-primary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--ink-primary)] text-[var(--canvas-bg)] text-[11px] flex items-center justify-center">1</span>
                  <span>2つのカテゴリーに分けて管理</span>
                </div>
                <p className="text-[var(--ink-muted)] pl-7 leading-relaxed">
                  メイン画面の「やること」（タスク・作業）と「買うもの」（買い物・消耗品）から選び、それぞれのノート一覧を開きます。
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[var(--canvas-bg)] border border-[var(--canvas-line-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[var(--ink-primary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--ink-primary)] text-[var(--canvas-bg)] text-[11px] flex items-center justify-center">2</span>
                  <span>3段階の重要度で自動並び替え</span>
                </div>
                <p className="text-[var(--ink-muted)] pl-7 leading-relaxed">
                  追加時に「やばめ」「そこそこ」「後で」を選択すると、リスト上で優先度の高い順に自動整列されます。
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[var(--canvas-bg)] border border-[var(--canvas-line-subtle)] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[var(--ink-primary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--ink-primary)] text-[var(--canvas-bg)] text-[11px] flex items-center justify-center">3</span>
                  <span>タップで完了チェック</span>
                </div>
                <p className="text-[var(--ink-muted)] pl-7 leading-relaxed">
                  項目の左側にあるチェックボックスをタップすると完了になり、下部の「完了済み」リストへ移動します。再度タップで未完了に戻せます。
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-[var(--ink-primary)] text-[var(--canvas-bg)] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              ノートを使い始める
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
