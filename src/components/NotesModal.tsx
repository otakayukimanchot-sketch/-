import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
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
            className="relative w-full max-w-md bg-[var(--bg-primary)] border-2 border-[var(--text-active)] p-10 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400 text-black rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">ご利用上の注意点</h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-bold border-l-4 border-yellow-400 pl-3">データの保存について</h3>
                <p>
                  追加した吹き出しデータは、お使いのブラウザの「LocalStorage」に保存されます。
                </p>
                <p className="bg-red-50 dark:bg-red-950/20 p-3 rounded-xl text-red-600 dark:text-red-400 font-medium">
                  ブラウザの履歴やキャッシュ、サイトデータを削除すると、すべての吹き出しが消えてしまいますのでご注意ください。
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold border-l-4 border-yellow-400 pl-3">同期とログイン</h3>
                <p>
                  本アプリはログイン機能がありません。そのため、スマートフォンで作成したメモをPCで見る、といった「デバイス間の同期」はできません。
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold border-l-4 border-yellow-400 pl-3">推奨環境</h3>
                <p>
                  プライベートモード（シークレットモード）で使用すると、ブラウザを閉じた際にデータが消える場合があります。
                </p>
              </section>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-4 bg-[var(--text-active)] text-[var(--bg-primary)] rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              確認しました
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
