// الجمع العربي الصحيح: واحد، اثنان، 3 إلى 10، 11 فأكثر.
// plural(5, 'درس', 'دروساً') → '5 دروس'؛ plural(1,'درس','دروساً') → 'درس واحد'
export function plural(n: number, singular: string, many: string): string {
  if (n === 0) return `لا ${singular}`;
  if (n === 1) return `${singular} واحد`;
  if (n === 2) return `${singular}ان`;
  if (n >= 3 && n <= 10) return `${n} ${many.replace('اً', 'اً')}`;
  return `${n} ${singular}`;
}

/** صيغ مخصصة حين تختلف صورة المفرد عن صورة الـ11+: plural(12,'درس','دروس','دروساً'). */
export function plural3(n: number, singular: string, two: string, few: string, many: string): string {
  if (n === 0) return `لا ${singular}`;
  if (n === 1) return `${singular} واحد`;
  if (n === 2) return two;
  if (n >= 3 && n <= 10) return `${n} ${few}`;
  return `${n} ${many}`;
}
