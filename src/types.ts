export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface Reminder {
  id: string;
  text: string;
  importance: number; // 0 to 100
  createdAt: string; // ISO string
}

export interface AppState {
  reminders: Reminder[];
  theme: Theme;
}
