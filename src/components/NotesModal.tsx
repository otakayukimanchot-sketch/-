import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, ShieldCheck, Database, Smartphone } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
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
            className="relative w-full max-w-md bg-[var(--canvas-surface)] border border-[var(--canvas-line)] p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="absolute top-4 right-4 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:bg-[var(--canvas-line-subtle)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
                  ご利用上の注意点
                </h2>
                <p className="text-xs text-[var(--ink-muted)]">データの保存とお取り扱いについて</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--ink-primary)] leading-relaxed">
              <section className="p-3.5 rounded-xl bg-[var(--canvas-bg)] border border-[var(--canvas-line-subtle)] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[var(--ink-primary)]">
                  <Database size={15} />
                  <span>データの保存場所</span>
                </div>
                <p className="text-[var(--ink-muted)] pl-6 text-xs">
                  すべてのタスクとメモは、お使いの端末ブラウザ内（LocalStorage）にのみ安全に保存されます。外部サーバーには送信されません。
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-[var(--canvas-bg)] border border-[var(--canvas-line-subtle)] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[var(--ink-primary)]">
                  <Smartphone size={15} />
                  <span>端末・ブラウザ間での共有</span>
                </div>
                <p className="text-[var(--ink-muted)] pl-6 text-xs">
                  アカウント登録不要で手軽に使える仕組みのため、PCとスマートフォンなど異なる端末間での自動同期機能はありません。
                </p>
              </section>

              <section className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <ShieldCheck size={15} />
                  <span>キャッシュ消去時の注意</span>
                </div>
                <p className="text-amber-900/80 dark:text-amber-200/80 pl-6 text-xs">
                  ブラウザの履歴やCookie・サイトデータをすべて消去すると、保存されていたタスクも一緒に削除される場合がありますのでご注意ください。
                </p>
              </section>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-[var(--ink-primary)] text-[var(--canvas-bg)] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              理解しました
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
