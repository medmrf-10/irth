// توست عالمي بسيط — نفس شكل التجريبي: شريحة سفلية تظهر 1.6 ثانية.
import { create } from 'zustand';

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToast = create<{ text: string; show: (t: string) => void }>((set) => ({
  text: '',
  show: (text) => {
    set({ text });
    clearTimeout(timer);
    timer = setTimeout(() => set({ text: '' }), 1600);
  },
}));
