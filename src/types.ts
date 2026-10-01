export type Category = 'todo' | 'shopping';

export type Priority = 'urgent' | 'medium' | 'later';

export interface TodoItem {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string | null;
  order?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

// Backwards compatibility migration types
export interface LegacyReminder {
  id: string;
  text?: string;
  title?: string;
  importance?: number;
  priority?: Priority;
  category?: Category;
  completed?: boolean;
  createdAt?: string;
  completedAt?: string | null;
  x?: number;
  y?: number;
}

export interface AppState {
  items: TodoItem[];
  themeMode: ThemeMode;
}

export const CATEGORY_INFO: Record<Category, { title: string; subtitle: string; shortDesc: string }> = {
  todo: {
    title: 'やること',
    subtitle: '仕事・予定・作業・タスク',
    shortDesc: '自分が行う必要のあること',
  },
  shopping: {
    title: '買うもの',
    subtitle: '日用品・食材・買いたい物',
    shortDesc: 'スーパーや買い物で購入するもの',
  },
};

export const PRIORITY_INFO: Record<Priority, { label: string; description: string; weight: number }> = {
  urgent: {
    label: 'やばめ',
    description: '緊急・重要度が高い（今すぐ）',
    weight: 1,
  },
  medium: {
    label: 'そこそこ',
    description: '近いうちにやる必要がある',
    weight: 2,
  },
  later: {
    label: '後で',
    description: '今すぐではない・空いた時間に',
    weight: 3,
  },
};
