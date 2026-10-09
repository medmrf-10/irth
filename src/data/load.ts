// تحميل الجداول وملفات المحتوى مع ذاكرة مؤقتة في الجلسة.
// القراءة دائماً بـ cache: 'no-cache' حتى لا تظهر نسخة قديمة من المنشور.

import type {
  Align,
  Highlights,
  Person,
  Questions,
  Science,
  Series,
  Summary,
  Table,
  UserData,
  Video,
  Work,
} from './types';

const cache = new Map<string, Promise<unknown>>();

function get<T>(url: string): Promise<T> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url, { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r.json() as Promise<T>;
    });
    cache.set(url, p);
  }
  return p as Promise<T>;
}

const BASE = import.meta.env.BASE_URL;

export const tables = {
  sciences: () => get<Table<Science>>(`${BASE}data/sciences.json`),
  persons: () => get<Table<Person>>(`${BASE}data/persons.json`),
  works: () => get<Table<Work>>(`${BASE}data/works.json`),
  videos: () => get<Table<Video>>(`${BASE}data/tube/videos.json`),
  series: () => get<Table<Series>>(`${BASE}data/tube/series.json`),
};

const contentDir = (videoId: string, file: string) => `${BASE}content/tube/${videoId}/${file}`;

export const content = {
  align: (id: string) => get<Align>(contentDir(id, 'align.json')),
  summary: (id: string) => get<Summary>(contentDir(id, 'summary.json')),
  questions: (id: string) => get<Questions>(contentDir(id, 'questions.json')),
  highlights: (id: string) => get<Highlights>(contentDir(id, 'highlights.json')),
  transcript: async (id: string) => {
    const r = await fetch(contentDir(id, 'transcript.txt'), { cache: 'no-cache' });
    if (!r.ok) throw new Error(`transcript ${id}: ${r.status}`);
    return r.text();
  },
};

export const userFile = (userId: string) => get<UserData>(`${BASE}users/${userId}.json`);

/** يُفرّغ الذاكرة المؤقتة — بعد حفظ التعديلات في الريبو. */
export function clearCache() {
  cache.clear();
}
