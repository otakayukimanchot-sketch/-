import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X, Sun, Moon, Trash2, HelpCircle } from 'lucide-react';
import { Theme } from '../types';

interface MenuProps {
  theme: Theme;
  onToggleTheme: () => void;
  onClearAll: () => void;
  onShowTutorial: () => void;
}

export const Menu: React.FC<MenuProps> = ({ theme, onToggleTheme, onClearAll, onShowTutorial }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: '使い方',
      icon: <HelpCircle size={20} />,
      onClick: () => { onShowTutorial(); setIsOpen(false); }
    },
    {
      label: theme === Theme.LIGHT ? 'ダークモード' : 'ライトモード',
      icon: theme === Theme.LIGHT ? <Moon size={20} /> : <Sun size={20} />,
      onClick: () => { onToggleTheme(); }
    },
    {
      label: 'すべて削除',
      icon: <Trash2 size={20} />,
      onClick: () => { 
        if (confirm('すべてのリマインダーを削除してもよろしいですか？')) {
          onClearAll(); 
          setIsOpen(false);
        }
      }
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 bg-[var(--bg-primary)] border-2 border-[var(--text-active)] rounded-xl hover:scale-105 transition-transform"
        id="menu-btn"
      >
        <MenuIcon size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 h-full bg-[var(--bg-primary)] border-l-2 border-[var(--text-active)] p-8 shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="self-end p-2 mb-8 hover:rotate-90 transition-transform"
              >
                <X size={28} />
              </button>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--text-active)] hover:text-[var(--bg-primary)] transition-colors text-left font-medium"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-8 border-t border-[var(--text-muted)] opacity-50">
                <p className="text-[10px] uppercase tracking-widest text-center">
                  ふきリマ v1.0
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
