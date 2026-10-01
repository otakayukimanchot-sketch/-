import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Priority, TodoItem, ThemeMode, LegacyReminder } from './types';
import { CategoryTabs } from './components/CategoryTabs';
import { TodoListView } from './components/TodoListView';
import { AddTodoModal } from './components/AddTodoModal';
import { Menu } from './components/Menu';
import { Tutorial } from './components/Tutorial';
import { ShareModal } from './components/ShareModal';
import { NotesModal } from './components/NotesModal';

const STORAGE_KEY = 'fukimemo_data';
const APP_PUBLIC_URL = 'https://fukimemo.vercel.app/';

const INITIAL_SAMPLE_ITEMS: TodoItem[] = [
  {
    id: 'sample-1',
    title: '資料を提出する',
    category: 'todo',
    priority: 'urgent',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'メールを返信する',
    category: 'todo',
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'sample-3',
    title: '部屋を掃除する',
    category: 'todo',
    priority: 'later',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'sample-4',
    title: '牛乳・たまご',
    category: 'shopping',
    priority: 'urgent',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'sample-5',
    title: 'ティッシュペーパー',
    category: 'shopping',
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'sample-6',
    title: 'シャンプーの詰め替え',
    category: 'shopping',
    priority: 'later',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

export default function App() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('todo');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDarkEffective, setIsDarkEffective] = useState(false);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addCategory, setAddCategory] = useState<Category>('todo');
  const [editingItem, setEditingItem] = useState<TodoItem | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // System Dark Mode Detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (themeMode === 'system') {
        setIsDarkEffective(mediaQuery.matches);
      } else {
        setIsDarkEffective(themeMode === 'dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeMode]);

  // Apply theme class to document
  useEffect(() => {
    if (isDarkEffective) {
      document.documentElement.classList.add('theme-dark');
      document.body.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.remove('theme-dark');
    }
  }, [isDarkEffective]);

  // Load and migrate data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('fukirima_data');
    const hasSeenTutorial = localStorage.getItem('fukimemo_tutorial_seen');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.themeMode) {
          setThemeMode(parsed.themeMode);
        } else if (parsed.theme) {
          setThemeMode(parsed.theme === 'dark' ? 'dark' : 'light');
        }

        const rawItems = parsed.items || parsed.reminders || [];
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const migrated: TodoItem[] = rawItems.map((raw: LegacyReminder, index: number) => {
            let priority: Priority = 'medium';
            if (raw.priority) {
              priority = raw.priority;
            } else if (typeof raw.importance === 'number') {
              if (raw.importance >= 70) priority = 'urgent';
              else if (raw.importance >= 35) priority = 'medium';
              else priority = 'later';
            }

            return {
              id: raw.id || `migrated-${index}-${Date.now()}`,
              title: raw.title || raw.text || '無題のメモ',
              category: raw.category || 'todo',
              priority,
              completed: !!raw.completed,
              createdAt: raw.createdAt || new Date().toISOString(),
              completedAt: raw.completedAt || null,
            };
          });
          setItems(migrated);
        } else {
          setItems(INITIAL_SAMPLE_ITEMS);
        }
      } catch (e) {
        console.error('Failed to parse storage:', e);
        setItems(INITIAL_SAMPLE_ITEMS);
      }
    } else {
      setItems(INITIAL_SAMPLE_ITEMS);
    }

    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('fukimemo_tutorial_seen', 'true');
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, themeMode }));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: [], themeMode }));
    }
  }, [items, themeMode]);

  // Handlers
  const handleToggleComplete = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          return {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        }
        return item;
      })
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleEdit = useCallback((item: TodoItem) => {
    setEditingItem(item);
    setIsAddOpen(true);
  }, []);

  const handleOpenAdd = useCallback((category?: Category) => {
    setEditingItem(null);
    setAddCategory(category || activeCategory);
    setIsAddOpen(true);
  }, [activeCategory]);

  const handleSaveTodo = useCallback((data: { title: string; category: Category; priority: Priority; id?: string }) => {
    if (data.id) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                title: data.title,
                category: data.category,
                priority: data.priority,
              }
            : item
        )
      );
    } else {
      const newItem: TodoItem = {
        id: crypto.randomUUID(),
        title: data.title,
        category: data.category,
        priority: data.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [...prev, newItem]);
    }
    setEditingItem(null);
  }, []);

  const handleClearCompleted = useCallback((category: Category) => {
    setItems((prev) => prev.filter((item) => !(item.category === category && item.completed)));
  }, []);

  const handleMoveCategory = useCallback((id: string, newCategory: Category) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category: newCategory } : item))
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setItems([]);
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');
    const dayStr = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    return { dateStr, dayStr };
  }, []);

  const todoCount = useMemo(() => {
    return items.filter((i) => i.category === 'todo' && !i.completed).length;
  }, [items]);

  const shoppingCount = useMemo(() => {
    return items.filter((i) => i.category === 'shopping' && !i.completed).length;
  }, [items]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)] pb-28">
      {/* Top Header - Apple / Stripe Style Flat Header */}
      <header className="w-full border-b border-[var(--line-border)] bg-[var(--bg-primary)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              ふきメモ
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs text-[var(--text-secondary)] font-mono hidden sm:block">
              <span>{today.dateStr}</span>
              <span className="ml-1 text-[var(--text-tertiary)]">({today.dayStr})</span>
            </div>

            <Menu
              themeMode={themeMode}
              onChangeThemeMode={setThemeMode}
              onClearAll={handleClearAll}
              onShowTutorial={() => setShowTutorial(true)}
              onShowShare={() => setShowShare(true)}
              onShowNotes={() => setShowNotes(true)}
            />
          </div>
        </div>
      </header>

      {/* Main Container - Full-width vertical reading flow */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-6 space-y-6">
        {/* Category Navigation - Flat underline tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          todoCount={todoCount}
          shoppingCount={shoppingCount}
        />

        {/* Content Section */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <TodoListView
                category={activeCategory}
                items={items}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onOpenAdd={handleOpenAdd}
                onClearCompleted={handleClearCompleted}
                onMoveCategory={handleMoveCategory}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Add / Edit Todo Modal */}
      <AddTodoModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveTodo}
        initialCategory={addCategory}
        editingItem={editingItem}
      />

      {/* Tutorial Modal */}
      <Tutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={APP_PUBLIC_URL}
      />

      {/* Notes Modal */}
      <NotesModal
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />
    </div>
  );
}
