import React from 'react';
import { motion } from 'motion/react';
import { CheckSquare, ShoppingBag } from 'lucide-react';
import { Category, CATEGORY_INFO } from '../types';

interface CategoryTabsProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  todoCount: number;
  shoppingCount: number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  todoCount,
  shoppingCount,
}) => {
  const tabs = [
    {
      key: 'todo' as Category,
      title: CATEGORY_INFO.todo.title,
      icon: CheckSquare,
      count: todoCount,
    },
    {
      key: 'shopping' as Category,
      title: CATEGORY_INFO.shopping.title,
      icon: ShoppingBag,
      count: shoppingCount,
    },
  ];

  return (
    <div className="w-full">
      <div 
        role="tablist"
        aria-label="カテゴリー選択"
        className="grid grid-cols-2 p-1.5 rounded-2xl bg-[var(--canvas-line-subtle)] border border-[var(--canvas-line)] shadow-inner"
      >
        {tabs.map((tab) => {
          const isSelected = activeCategory === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => onSelectCategory(tab.key)}
              className={`relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[var(--canvas-surface)] text-[var(--ink-primary)] shadow-sm'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:bg-[var(--canvas-surface)]/50'
              }`}
            >
              <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} />
              <span>{tab.title}</span>

              {/* Counter badge */}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium tabular-nums transition-colors ${
                  isSelected
                    ? 'bg-[var(--ink-primary)] text-[var(--canvas-surface)]'
                    : 'bg-[var(--canvas-line)] text-[var(--ink-muted)]'
                }`}
              >
                {tab.count}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--ink-primary)] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
