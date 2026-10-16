export interface LoveLetter {
  id: string;
  title: string;
  subtitle: string;
  category: 'miss-you' | 'comfort' | 'future' | 'midnight' | 'secrets' | 'promises';
  content: string;
  poemExcerpt?: string;
  date: string;
  waxSealColor: string;
  isUserCreated?: boolean;
}

export interface PersianPoem {
  id: string;
  poet: string;
  verses: string[];
  theme: string;
  noteForNazanin: string;
}

export interface LoveReason {
  id: number;
  text: string;
  tag: string;
}

export interface CountdownConfig {
  targetDate: string; // ISO string
  startDate: string;  // ISO string
  label: string;
  reunionCity: string;
}
