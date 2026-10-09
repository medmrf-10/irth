// حالة المستخدم محلياً: الثيم والإعدادات والتقدّم والمفضلة.
// التخزين فوري في localStorage؛ المزامنة مع الريبو في user/sync.ts.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeId, UserData, VideoProgress } from '../data/types';

const USER_ID = 'u1'; // المستخدم الوحيد الآن: صاحب المشروع.

interface UserState {
  user: string;
  theme: ThemeId;
  favorites: string[];
  questionsDensity: 'off' | 'low' | 'mid' | 'high';
  progress: Record<string, VideoProgress>;
  days: Record<string, number>;
  answers: Record<string, Record<string, boolean>>;
  setTheme: (t: ThemeId) => void;
  toggleFavorite: (seriesId: string) => void;
  setQuestionsDensity: (d: UserState['questionsDensity']) => void;
  recordListen: (videoId: string, heardSec: number, pos: number, done: boolean) => void;
  recordAnswer: (videoId: string, questionId: string, ok: boolean) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: USER_ID,
      theme: 'night',
      favorites: [],
      questionsDensity: 'mid',
      progress: {},
      days: {},
      answers: {},
      setTheme: (theme) => set({ theme }),
      toggleFavorite: (seriesId) =>
        set((s) => ({
          favorites: s.favorites.includes(seriesId)
            ? s.favorites.filter((f) => f !== seriesId)
            : [...s.favorites, seriesId],
        })),
      setQuestionsDensity: (questionsDensity) => set({ questionsDensity }),
      recordListen: (videoId, heardSec, pos, done) =>
        set((s) => {
          const p = s.progress[videoId];
          const reached95 = done && (!p || p.done === 0);
          return {
            progress: {
              ...s.progress,
              [videoId]: {
                pos,
                heard: (p?.heard ?? 0) + heardSec,
                done: (p?.done ?? 0) + (reached95 ? 1 : 0),
                last: today(),
              },
            },
            days: { ...s.days, [today()]: (s.days[today()] ?? 0) + heardSec },
          };
        }),
      recordAnswer: (videoId, questionId, ok) =>
        set((s) => ({
          answers: {
            ...s.answers,
            [videoId]: { ...(s.answers[videoId] ?? {}), [questionId]: ok },
          },
        })),
    }),
    { name: 'irth-user' },
  ),
);

/** يجمع حالة المتجر الحالية في شكل ملف users/<id>.json لرفعه للريبو. */
export function toUserData(): UserData {
  const s = useUser.getState();
  return {
    v: 1,
    user: s.user,
    favorites: s.favorites,
    settings: { questions: s.questionsDensity, theme: s.theme },
    progress: s.progress,
    days: s.days,
    answers: s.answers,
  };
}
