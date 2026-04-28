import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';

interface AddFormProps {
  onAdd: (text: string, importance: number) => void;
}

export const AddForm: React.FC<AddFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [importance, setImportance] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), importance);
      setText('');
      setImportance(50);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[var(--text-active)] text-[var(--bg-primary)] rounded-full flex items-center justify-center shadow-lg z-50 border-2 border-[var(--bg-primary)]"
        id="add-reminder-btn"
      >
        <Plus size={32} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.form
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative w-full max-w-sm bg-[var(--bg-primary)] border-2 border-[var(--text-active)] p-8 rounded-3xl shadow-2xl space-y-6"
            >
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[var(--text-active)] p-1"
              >
                <X size={24} />
              </button>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                  What
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="例：課題をやる"
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 50))}
                  className="w-full bg-transparent border-b-2 border-[var(--text-active)] py-2 text-xl outline-none placeholder:opacity-30"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-widest font-bold text-[var(--text-muted)]">
                    Importance
                  </label>
                  <span className="font-mono text-sm">{importance}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={importance}
                  onChange={(e) => setImportance(parseInt(e.target.value))}
                  className="w-full h-1 bg-[var(--text-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--text-active)]"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] uppercase tracking-tighter">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full py-4 bg-[var(--text-active)] text-[var(--bg-primary)] rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-30 transition-all uppercase tracking-widest"
              >
                Add Bubble
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
