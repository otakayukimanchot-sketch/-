import React from 'react';
import { motion } from 'motion/react';
import { Reminder } from '../types';

interface BubbleProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDragStart: () => void;
  isDragging: boolean;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const Bubble: React.FC<BubbleProps> = ({ reminder, onDelete, onPositionChange, onDragStart, isDragging: isDraggingState, scale, containerRef }) => {
  // Base size is 120px to 280px depending on importance
  const baseSize = 120 + (reminder.importance * 1.6);
  const size = baseSize * scale;
  
  // Format date: MM/DD
  const dateStr = new Date(reminder.createdAt).toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });

  const lastClickTime = React.useRef<number>(0);
  const isDragging = React.useRef(false);

  const handleClick = () => {
    if (isDragging.current) return;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // 300ms以内ならダブルタップ

    if (now - lastClickTime.current < DOUBLE_TAP_DELAY) {
      onDelete(reminder.id);
    }
    lastClickTime.current = now;
  };

  const handleDragEnd = (_: any, info: any) => {
    if (!containerRef.current) return;
    
    // Set dragging to false with a small delay to prevent accidental clicks
    setTimeout(() => {
      isDragging.current = false;
    }, 50);

    const rect = containerRef.current.getBoundingClientRect();
    const newX = (info.point.x - rect.left) / rect.width;
    const newY = (info.point.y - rect.top) / rect.height;
    
    onPositionChange(reminder.id, newX, newY);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      onDragStart={() => { 
        isDragging.current = true;
        onDragStart();
      }}
      onDragEnd={handleDragEnd}
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        left: isDraggingState ? undefined : `${reminder.x * 100}%`,
        top: isDraggingState ? undefined : `${reminder.y * 100}%`,
      }}
      whileDrag={{ zIndex: 1000, scale: 1.05 }}
      exit={{ 
        scale: 1.4, 
        opacity: 0, 
        filter: "blur(10px)",
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer select-none group"
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
