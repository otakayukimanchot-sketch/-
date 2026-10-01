import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ふきメモ - キャンバスノートTodo',
          text: '白いキャンバスノートに書き込むような、温かみのあるシンプルなTodoアプリ「ふきメモ」',
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
            className="relative w-full max-w-sm bg-[var(--canvas-surface)] border border-[var(--canvas-line)] p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="absolute top-4 right-4 p-2 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:bg-[var(--canvas-line-subtle)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
                アプリを紹介する
              </h2>
              <p className="text-xs text-[var(--ink-muted)]">
                家族や友人と共有して使えます
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[var(--canvas-line)] shadow-xs">
              <QRCodeSVG
                value={url}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 p-2.5 bg-[var(--canvas-bg)] border border-[var(--canvas-line)] rounded-xl overflow-hidden">
                <span className="flex-1 truncate text-xs font-mono text-[var(--ink-muted)] select-all px-1">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--canvas-surface)] border border-[var(--canvas-line)] text-xs font-medium text-[var(--ink-primary)] hover:bg-[var(--canvas-line-subtle)] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? 'コピー済' : 'コピー'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3.5 bg-[var(--ink-primary)] text-[var(--canvas-bg)] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Share2 size={16} />
                <span>リンクを共有する</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
