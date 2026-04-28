export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface Reminder {
  id: string;
  text: string;
  importance: number; // 0 to 100
  createdAt: string; // ISO string
  x: number; // 0 to 1 (relative position)
  y: number; // 0 to 1 (relative position)
}

export interface AppState {
  reminders: Reminder[];
  theme: Theme;
}
