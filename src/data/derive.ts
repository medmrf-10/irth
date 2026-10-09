// كل ما يُحسب من الجداول — ولا يُكرَّر منطقه في الصفحات أبداً.
// القاعدة من data.md: ما يمكن حسابه لا يُخزَّن.

import type { Person, Series, Table, Video } from './types';

/** فيديوهات الموقع المرئية — تستبعد المرفوضة. */
export function visibleVideos(videos: Table<Video>): Video[] {
  return videos.rows.filter((v) => v.status !== 'rejected');
}

/** خريطة id→فيديو. */
export function videoMap(videos: Table<Video>): Map<string, Video> {
  return new Map(visibleVideos(videos).map((v) => [v.id, v]));
}

/** المشايخ في tube: كل شخص له فيديو واحد على الأقل (بـspeakers). */
export function sheikhsOf(videos: Table<Video>, persons: Table<Person>): Person[] {
  const ids = new Set(visibleVideos(videos).flatMap((v) => v.speakers ?? []));
  return persons.rows.filter((p) => ids.has(p.id));
}

/** سلاسل شخص معين — كل سلسلة فيها فيديو واحد على الأقل من متحدثيه. */
export function seriesOfSheikh(series: Table<Series>, videos: Table<Video>, personId: string): Series[] {
  const vm = videoMap(videos);
  return series.rows.filter((s) => s.items.some((id) => vm.get(id)?.speakers?.includes(personId)));
}

/** دروس الشيخ المفردة — ليست في items أي سلسلة. */
export function standaloneOf(videos: Table<Video>, series: Table<Series>, personId: string): Video[] {
  const inSeries = new Set(series.rows.flatMap((s) => s.items));
  return visibleVideos(videos).filter(
    (v) => v.speakers?.includes(personId) && !inSeries.has(v.id),
  );
}

/** مدة السلسلة الكلية بالثواني. */
export function seriesDuration(s: Series, videos: Table<Video>): number {
  const vm = videoMap(videos);
  return s.items.reduce((sum, id) => sum + (vm.get(id)?.duration ?? 0), 0);
}

/** شيخ السلسلة: المتحدث المشترك في دروسها، وإلا undefined. */
export function seriesSheikh(s: Series, videos: Table<Video>): string | undefined {
  const vm = videoMap(videos);
  const counts = new Map<string, number>();
  for (const id of s.items) {
    for (const sp of vm.get(id)?.speakers ?? []) counts.set(sp, (counts.get(sp) ?? 0) + 1);
  }
  let best: string | undefined;
  let n = 0;
  for (const [k, c] of counts) if (c > n) ((best = k), (n = c));
  return best;
}

/** كتاب السلسلة: أكثر قيمة work تكراراً في دروسها. */
export function seriesWork(s: Series, videos: Table<Video>): string | undefined {
  const vm = videoMap(videos);
  const counts = new Map<string, number>();
  for (const id of s.items) {
    const w = vm.get(id)?.work;
    if (w) counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  let best: string | undefined;
  let n = 0;
  for (const [k, c] of counts) if (c > n) ((best = k), (n = c));
  return best;
}

/** رقم الدرس داخل سلسلة (يبدأ من 1)، وإلا undefined إن لم يكن فيها. */
export function lessonNumber(s: Series, videoId: string): number | undefined {
  const i = s.items.indexOf(videoId);
  return i === -1 ? undefined : i + 1;
}

/** السلسلة التالية/السابقة للفيديو داخل سلسلة. */
export function lessonNeighbors(s: Series, videoId: string): { prev?: string; next?: string } {
  const i = s.items.indexOf(videoId);
  return {
    prev: i > 0 ? s.items[i - 1] : undefined,
    next: i !== -1 && i < s.items.length - 1 ? s.items[i + 1] : undefined,
  };
}
