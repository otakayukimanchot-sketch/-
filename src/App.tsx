import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Theme, Reminder } from './types';
import { Bubble } from './components/Bubble';
import { AddForm } from './components/AddForm';
import { Menu } from './components/Menu';
import { Tutorial } from './components/Tutorial';
import { ShareModal } from './components/ShareModal';
import { NotesModal } from './components/NotesModal';

const STORAGE_KEY = 'fukimemo_data';
const APP_PUBLIC_URL = 'https://fukimemo.vercel.app/';

export default function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [scale, setScale] = useState(1);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('fukirima_data');
    const hasSeenTutorial = localStorage.getItem('fukimemo_tutorial_seen');

    if (saved) {
      try {
        const { reminders: savedReminders, theme: savedTheme } = JSON.parse(saved);
        setReminders(savedReminders);
        setTheme(savedTheme || Theme.LIGHT);
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    }

    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('fukimemo_tutorial_seen', 'true');
    }
  }, []);

  // Save data & theme application
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ reminders, theme }));
    document.body.className = `theme-${theme}`;
  }, [reminders, theme]);

  // Scaling logic & Collision Resolution (Force-directed layout inspired)
  useEffect(() => {
    const solveCollisions = () => {
      if (!containerRef.current || reminders.length === 0) {
        setScale(1);
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 1. Calculate ideal scale based on density
      const totalRawArea = reminders.reduce((acc, r) => {
        const h = (120 + r.importance * 1.6);
        const w = h * 1.3;
        return acc + (w * h);
      }, 0);

      const targetDensity = 0.38; 
      const screenArea = viewportWidth * viewportHeight;
      const areaBasedScale = Math.sqrt((screenArea * targetDensity) / totalRawArea);
      const countFactor = reminders.length > 5 ? Math.pow(0.95, reminders.length - 5) : 1;
      const finalScale = Math.max(0.12, Math.min(0.85, areaBasedScale * countFactor));
      
      setScale(finalScale);

      // 2. Force-directed spread
      let newReminders = [...reminders];
      const iterations = 15; // Increased iterations for stability
      const repulsionStrength = 0.04;
      const centerPull = 0.002; // Very weak pull to keep things from escaping too far

      for (let i = 0; i < iterations; i++) {
        for (let a = 0; a < newReminders.length; a++) {
          const ra = newReminders[a];
          
          // Repulsion from other bubbles
          for (let b = a + 1; b < newReminders.length; b++) {
            const rb = newReminders[b];
            
            const dx = (ra.x - rb.x);
            const dy = (ra.y - rb.y) * (viewportHeight / viewportWidth);
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq) || 0.01;
            
            // Interaction distance: bubbles want to be at least this far apart
            const ha = (120 + ra.importance * 1.6) * finalScale;
            const hb = (120 + rb.importance * 1.6) * finalScale;
            const idealDist = (Math.max(ha, hb) * 1.5) / viewportWidth;

            if (dist < idealDist) {
              const push = (idealDist - dist) * repulsionStrength;
              const moveX = (dx / dist) * push;
              const moveY = (dy / dist) * push * (viewportWidth / viewportHeight);

              newReminders[a] = { ...newReminders[a], x: newReminders[a].x + moveX, y: newReminders[a].y + moveY };
              newReminders[b] = { ...newReminders[b], x: newReminders[b].x - moveX, y: newReminders[b].y - moveY };
            }
          }
          
          // Weak pull to visual center area (slightly biased lower to avoid title)
          const centerX = 0.5;
          const centerY = 0.55;
          newReminders[a].x += (centerX - newReminders[a].x) * centerPull;
          newReminders[a].y += (centerY - newReminders[a].y) * centerPull;

          // Strict Edge constraints with padding
          const padX = 0.12;
          const padYTop = 0.18;
          const padYBottom = 0.15;
          
          if (newReminders[a].id !== draggingId) {
            newReminders[a].x = Math.max(padX, Math.min(1 - padX, newReminders[a].x));
            newReminders[a].y = Math.max(padYTop, Math.min(1 - padYBottom, newReminders[a].y));
          }
        }
      }

      // Update state if changed, ignoring the one being dragged for movement updates
      const changed = newReminders.some((r, j) => {
        if (r.id === draggingId) return false;
        return Math.abs(r.x - reminders[j].x) > 0.0005 || Math.abs(r.y - reminders[j].y) > 0.0005;
      });

      if (changed) {
        setReminders(newReminders);
      }
    };

    const timeoutId = setTimeout(solveCollisions, 50);
    window.addEventListener('resize', solveCollisions);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', solveCollisions);
    };
  }, [reminders]);

  const addReminder = (text: string, importance: number) => {
    // Safe margins: 15% from left/right, 20% from top (avoid title), 15% from bottom
    const x = 0.1 + Math.random() * 0.8;
    const y = 0.1 + Math.random() * 0.8;

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      text,
      importance,
      createdAt: new Date().toISOString(),
      x,
      y,
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReminderPosition = (id: string, x: number, y: number) => {
    setReminders((prev) => 
      prev.map((r) => (r.id === id ? { ...r, x, y } : r))
    );
    setDraggingId(null);
  };

  const clearAll = () => {
    setReminders([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  const dayStr = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center select-none"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* App Logo/Title with Integrated Frosted Glass */}
      <div className="fixed top-0 left-0 pt-6 pl-6 pr-12 pb-10 z-50 rounded-br-[64px] backdrop-blur-[40px] pointer-events-none">
        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none text-[var(--text-active)]">
          ふきメモ
        </h1>
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[var(--text-muted)] mt-1.5 block">
          吹き出しメモ
        </span>
      </div>

      {/* Date & Weekday Display */}
      <div className="fixed top-6 right-20 z-50 flex items-center gap-3 pr-4 pointer-events-none">
        <div className="text-right">
          <div className="text-sm font-black tracking-widest text-[var(--text-active)] lining-nums leading-none">
            {dateStr}
          </div>
          <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">
            {dayStr}曜日
          </div>
        </div>
        <div className="w-[1px] h-6 bg-[var(--text-active)]/10" />
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-full"
      >
        <AnimatePresence mode="popLayout">
          {reminders.map((reminder) => (
            <Bubble
              key={reminder.id}
              reminder={reminder}
              onDelete={deleteReminder}
              onPositionChange={updateReminderPosition}
              onDragStart={() => setDraggingId(reminder.id)}
              isDragging={draggingId === reminder.id}
              scale={scale}
              containerRef={containerRef}
            />
          ))}
        </AnimatePresence>

        {reminders.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)] text-center space-y-4 animate-pulse pointer-events-none">
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
        onShowShare={() => setShowShare(true)}
        onShowNotes={() => setShowNotes(true)}
      />

      <Tutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={APP_PUBLIC_URL}
      />

      <NotesModal
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />
    </div>
  );
}
