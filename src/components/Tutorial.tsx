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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-[var(--bg-primary)] border-2 border-[var(--text-active)] p-10 rounded-3xl shadow-2xl flex flex-col gap-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">ふきリマの使い方</h2>
              <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase font-mono">Simple is Best</p>
            </div>

            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-bold border-l-4 border-[var(--text-active)] pl-3">Whatの書き方</h3>
                <p className="text-sm leading-relaxed">
                  やることを短く書きましょう。1つの吹き出しには1つの行動だけ。
                </p>
                <div className="bg-[var(--text-muted)]/10 p-3 rounded-xl text-xs flex gap-4">
                  <span className="text-green-600 font-bold">✔ 推奨:</span>
                  <span>課題をやる、ゴミ出し、返信</span>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold border-l-4 border-[var(--text-active)] pl-3">Importance（重要度）</h3>
                <p className="text-sm leading-relaxed">
                  重要度が高いほど、吹き出しが大きく表示されます。
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold border-l-4 border-[var(--text-active)] pl-3">削除</h3>
                <p className="text-sm leading-relaxed">
                  終わったタスクは、吹き出しを <strong className="underline underline-offset-4">ダブルタップ</strong> して消しましょう。
                </p>
              </section>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-4 bg-[var(--text-active)] text-[var(--bg-primary)] rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              はじめる
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
