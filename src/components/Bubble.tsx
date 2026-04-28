import React from 'react';
import { motion } from 'motion/react';
import { Reminder } from '../types';

interface BubbleProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  scale: number;
}

export const Bubble: React.FC<BubbleProps> = ({ reminder, onDelete, scale }) => {
  // Base size is 120px to 280px depending on importance
  const baseSize = 120 + (reminder.importance * 1.6);
  const size = baseSize * scale;
  
  // Format date: MM/DD
  const dateStr = new Date(reminder.createdAt).toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });

  const handleDoubleClick = () => {
    onDelete(reminder.id);
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={handleDoubleClick}
      className="relative flex items-center justify-center cursor-pointer select-none group"
      style={{
        width: size * 1.3,
        height: size,
      }}
      title="ダブルタップで削除"
    >
      {/* Small dots for "thought" bubble look */}
      <div 
        className="absolute bottom-[5%] left-[10%] rounded-full border-2 border-[var(--bubble-border)] bg-[var(--bubble-bg)]"
        style={{ width: size * 0.1, height: size * 0.1 }}
      />
      <div 
        className="absolute bottom-[12%] left-[18%] rounded-full border-2 border-[var(--bubble-border)] bg-[var(--bubble-bg)]"
        style={{ width: size * 0.15, height: size * 0.15 }}
      />

      {/* Main Bubble */}
      <div 
        className="w-full h-full rounded-full border-2 border-[var(--bubble-border)] bg-[var(--bubble-bg)] flex flex-col items-center justify-center p-4 text-center overflow-hidden"
      >
        <span className="text-[var(--text-muted)] text-[0.7em] mb-1 font-mono">
          {dateStr}
        </span>
        <p 
          className="font-medium break-words w-full"
          style={{ fontSize: Math.max(12, size * 0.12) }}
        >
          {reminder.text}
        </p>
      </div>

      {/* Hint on hover (mobile might not see this, but desktop helps) */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] text-[var(--text-muted)]">
        Double tap to remove
      </div>
    </motion.div>
  );
};
