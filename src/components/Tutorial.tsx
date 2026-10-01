import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            className="relative w-full sm:max-w-lg bg-[var(--bg-primary)] border-t sm:border border-[var(--line-border)] p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line-border)]">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  使い方ガイド
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  シンプルで直感的なタスク管理
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

            <div className="space-y-6 text-sm text-[var(--text-primary)] leading-relaxed">
              <section className="space-y-1.5 pb-4 border-b border-[var(--line-subtle)]">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                  01. カテゴリーの切り替え
                </h3>
                <p className="text-sm">
                  画面上部の「やること」と「買うもの」のタブを切り替えることで、それぞれのタスク一覧をその場で即座に表示できます。
                </p>
              </section>

              <section className="space-y-1.5 pb-4 border-b border-[var(--line-subtle)]">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                  02. 3段階の重要度順に自動整理
                </h3>
                <p className="text-sm">
                  「やばめ」「そこそこ」「後で」の重要度を設定すると、リストの上から優先度順に自動で並び替わります。
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                  03. タップで完了
                </h3>
                <p className="text-sm">
                  各項目のチェックをタップすると取り消し線が引かれ、下部の「完了済み」へ移動します。再度タップでいつでも未完了に戻せます。
                </p>
              </section>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
