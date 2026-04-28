import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Theme, Reminder } from './types';
import { Bubble } from './components/Bubble';
import { AddForm } from './components/AddForm';
import { Menu } from './components/Menu';
import { Tutorial } from './components/Tutorial';

const STORAGE_KEY = 'fukirima_data';

export default function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [showTutorial, setShowTutorial] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { reminders: savedReminders, theme: savedTheme } = JSON.parse(saved);
        setReminders(savedReminders);
        setTheme(savedTheme || Theme.LIGHT);
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    } else {
      // First time user
      setShowTutorial(true);
    }
  }, []);

  // Save data & theme application
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ reminders, theme }));
    document.body.className = `theme-${theme}`;
  }, [reminders, theme]);

  // Scaling logic: All bubbles must fit in screen
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || reminders.length === 0) {
        setScale(1);
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Estimated area taken by each bubble: (120 + imp * 1.6)^2
      const totalArea = reminders.reduce((acc, r) => {
        const d = 120 + (r.importance * 1.6);
        return acc + (d * d);
      }, 0);

      // We want the total area to be roughly 60% of viewport to leave space
      const availableArea = (viewportWidth * viewportHeight) * 0.6;
      const calculatedScale = Math.sqrt(availableArea / totalArea);
      
      // Also factor in "too many items" scaling for visibility if square-root isn't enough
      // Limit scale within [0.2, 1.0]
      setScale(Math.max(0.2, Math.min(1.0, calculatedScale)));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [reminders]);

  const addReminder = (text: string, importance: number) => {
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      text,
      importance,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    setReminders([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center p-8 select-none"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div 
        ref={containerRef}
        className="flex flex-wrap items-center justify-center gap-8 w-full max-w-full"
      >
        <AnimatePresence mode="popLayout">
          {reminders.map((reminder) => (
            <Bubble
              key={reminder.id}
              reminder={reminder}
              onDelete={deleteReminder}
              scale={scale}
            />
          ))}
        </AnimatePresence>

        {reminders.length === 0 && (
          <div className="text-[var(--text-muted)] text-center space-y-4 animate-pulse">
            <p className="text-xl font-light tracking-widest uppercase">No Bubbles</p>
            <p className="text-xs">右下の＋ボタンから追加してください</p>
          </div>
        )}
      </div>

      <AddForm onAdd={addReminder} />
      
      <Menu 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onClearAll={clearAll} 
        onShowTutorial={() => setShowTutorial(true)}
      />

      <Tutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
}
