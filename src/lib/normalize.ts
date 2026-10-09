// تطبيع البحث العربي: يزيل التشكيل والتطويل ويوحّد الألف والهمزات والياء والتاء المربوطة.
export function normalizeArabic(s: string): string {
  return s
    .replace(/[ً-ْٰ]/g, '')
    .replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function matches(query: string, ...fields: (string | undefined)[]): boolean {
  const q = normalizeArabic(query);
  if (!q) return true;
  return fields.some((f) => f !== undefined && normalizeArabic(f).includes(q));
}
