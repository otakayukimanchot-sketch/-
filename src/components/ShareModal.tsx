import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ふきメモ',
          text: '直感的に使える、視覚的メモ「ふきメモ」',
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
    alert('リンクをコピーしました！');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-[var(--bg-primary)] border-2 border-[var(--text-active)] p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-tighter">紹介する</h2>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Share Fukimemo</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-[var(--text-active)]">
              <QRCodeSVG 
                value={url} 
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center gap-2 p-3 bg-[var(--text-muted)]/10 rounded-xl overflow-hidden">
                <span className="flex-1 truncate text-xs font-mono opacity-60 italic">{url}</span>
                <button onClick={handleCopy} className="p-2 hover:bg-[var(--text-active)] hover:text-[var(--bg-primary)] rounded-lg transition-colors">
                  <Copy size={16} />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full py-4 bg-[var(--text-active)] text-[var(--bg-primary)] rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                <Share2 size={20} />
                <span>Share Link</span>
              </button>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] text-center italic">
              二次元コードをスキャンして共有
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
