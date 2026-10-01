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
          title: 'ふきメモ',
          text: 'シンプルで洗練されたTodoアプリ「ふきメモ」',
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
            className="relative w-full sm:max-w-sm bg-[var(--bg-primary)] border-t sm:border border-[var(--line-border)] p-6 sm:p-8 flex flex-col items-center gap-6"
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--line-border)]">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  共有
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  リンクまたはQRコードで共有
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

            <div className="p-3 bg-white border border-[var(--line-border)]">
              <QRCodeSVG
                value={url}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] border border-[var(--line-border)] overflow-hidden">
                <span className="flex-1 truncate text-xs font-mono text-[var(--text-secondary)] select-all px-1">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-medium text-[var(--text-primary)] border border-[var(--line-border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copied ? '完了' : 'コピー'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
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
