// تنسيق المدة: «1:05:30» داخل الدرس، و«12 ساعة» في الملخصات.

export function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(r).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function hoursLabel(seconds: number): string {
  const h = Math.round(seconds / 360) / 10;
  if (h < 1) return `${Math.round(seconds / 60)} دقيقة`;
  if (h === 1) return 'ساعة';
  if (h === 2) return 'ساعتان';
  if (h <= 10) return `${h} ساعات`;
  return `${h} ساعة`;
}
