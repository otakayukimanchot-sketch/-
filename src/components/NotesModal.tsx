import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
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
            className="relative w-full sm:max-w-md bg-[var(--bg-primary)] border-t sm:border border-[var(--line-border)] p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line-border)]">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  ご利用上の注意点
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  データの保存とお取り扱い
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
              <section className="space-y-1 pb-4 border-b border-[var(--line-subtle)]">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                  ローカル保存
                </h3>
                <p className="text-sm">
                  すべてのタスクはお使いの端末のブラウザ内（LocalStorage）にのみ安全に保存されます。
                </p>
              </section>

              <section className="space-y-1 pb-4 border-b border-[var(--line-subtle)]">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                  デバイス間同期
                </h3>
                <p className="text-sm">
                  アカウント登録不要のシンプル設計のため、異なる端末間での同期は行われません。
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                  ブラウザデータの消去
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  ブラウザの履歴やCookie・サイトデータを消去すると、保存されているデータも一緒に削除されますのでご注意ください。
                </p>
              </section>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                理解しました
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
