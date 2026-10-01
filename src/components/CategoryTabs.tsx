import React from 'react';
import { motion } from 'motion/react';
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
      count: todoCount,
    },
    {
      key: 'shopping' as Category,
      title: CATEGORY_INFO.shopping.title,
      count: shoppingCount,
    },
  ];

  return (
    <nav 
      aria-label="カテゴリー切替"
      className="w-full border-b border-[var(--line-border)] flex items-center gap-8 text-sm"
    >
      {tabs.map((tab) => {
        const isSelected = activeCategory === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectCategory(tab.key)}
            className={`relative pb-3 pt-2 font-medium tracking-tight transition-colors flex items-center gap-2 cursor-pointer select-none ${
              isSelected
                ? 'text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span className="text-base sm:text-lg">{tab.title}</span>

            <span className="text-xs font-mono tabular-nums text-[var(--text-tertiary)]">
              {tab.count}
            </span>

            {isSelected && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--text-primary)]"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
