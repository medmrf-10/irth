// مزامنة بيانات المستخدم والتعديلات مع الريبو عبر GitHub API.
// مرحلة لاحقة: تجميع التعديلات محلياً ثم حفظها بالتزام واحد (شجرة→التزام→تحديث main)
// بمفتاح fine-grained يدخله صاحب المشروع في الإعدادات ويبقى في جواله فقط.
// الدمج عند الحفظ: الأكبر يغلب في heard وdone وdays، والأحدث في pos والمفضلة والإعدادات.

import type { UserData } from '../data/types';
import { toUserData } from './store';

const LS_KEY = 'irth-gh-key';

export function getToken(): string | null {
  return localStorage.getItem(LS_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(LS_KEY, token);
  else localStorage.removeItem(LS_KEY);
}

/** هل وضع التعديل متاح — يظهر فقط إذا كان المفتاح موجوداً. */
export function editModeAvailable(): boolean {
  return getToken() !== null;
}

export async function pushUserFile(): Promise<void> {
  const data: UserData = toUserData();
  // TODO (مرحلة المزامنة): PUT users/<user>.json عبر Git Data API.
  void data;
}
