// معرض المشايخ — الرئيسية: شبكة صور دائرية + بحث + بطاقة استكمال.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { tables } from '../../../data/load';
import { useAsync } from '../../../data/hooks';
import { visibleVideos } from '../../../data/derive';
import { normalizeArabic } from '../../../lib/normalize';
import { hoursLabel } from '../../../lib/duration';
import { plural3 } from '../../../lib/plural';
import { Empty, Page, TopBar } from '../../../ui/AppShell';
import { ResumeCard } from '../../../ui/ResumeCard';
import { useUser } from '../../../user/store';
import type { Person } from '../../../data/types';

const ring = (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.2" opacity=".4" />
  </svg>
);

function initial(name: string): string {
  const last = name.trim().split(/\s+/).pop() ?? '';
  return last.replace(/^ال/, '')[0] ?? '';
}

export default function SheikhsPage() {
  const [q, setQ] = useState('');
  const persons = useAsync(tables.persons);
  const videos = useAsync(tables.videos);
  const series = useAsync(tables.series);
  const progress = useUser((s) => s.progress);

  const sheikhs = useMemo(() => {
    if (!persons.data || !videos.data || !series.data) return [];
    const vs = visibleVideos(videos.data);
    const inSeries = new Set(series.data.rows.flatMap((s) => s.items));
    const stats = new Map<string, { person: Person; hours: number; series: number; free: number }>();
    for (const p of persons.data.rows) stats.set(p.id, { person: p, hours: 0, series: 0, free: 0 });
    for (const v of vs) {
      for (const sp of v.speakers ?? []) {
        const st = stats.get(sp);
        if (st) st.hours += v.duration;
      }
    }
    const vm = new Map(vs.map((v) => [v.id, v]));
    for (const s of series.data.rows) {
      const counts = new Map<string, number>();
      for (const id of s.items)
        for (const sp of vm.get(id)?.speakers ?? []) counts.set(sp, (counts.get(sp) ?? 0) + 1);
      let best: string | undefined;
      let n = 0;
      for (const [k, c] of counts) if (c > n) ((best = k), (n = c));
      if (best && stats.has(best)) stats.get(best)!.series++;
    }
    for (const v of vs)
      if (!inSeries.has(v.id))
        for (const sp of v.speakers ?? []) stats.get(sp) && stats.get(sp)!.free++;
    return [...stats.values()].filter((s) => s.hours > 0 || s.series > 0 || s.free > 0);
  }, [persons.data, videos.data, series.data]);

  const filtered = useMemo(() => {
    const n = normalizeArabic(q);
    return sheikhs.filter((s) => !n || normalizeArabic(s.person.name).includes(n));
  }, [sheikhs, q]);

  // أحدث درس قيد الاستماع لبطاقة «أكمل»
  const resume = useMemo(() => {
    if (!videos.data || !series.data) return null;
    const entries = Object.entries(progress).filter(([, p]) => p.pos > 0 && p.done === 0);
    if (!entries.length) return null;
    const [vid, p] = entries.sort((a, b) => b[1].last.localeCompare(a[1].last))[0];
    const v = videos.data.rows.find((x) => x.id === vid);
    if (!v) return null;
    const s = series.data.rows.find((sr) => sr.items.includes(vid));
    const n = s ? s.items.indexOf(vid) + 1 : undefined;
    const remain = Math.max(0, v.duration - p.pos);
    const sp = (v.speakers?.[0] && persons.data?.rows.find((x) => x.id === v.speakers![0])?.name) ?? '';
    return {
      videoId: vid,
      seriesQuery: s?.id,
      title: s?.title ?? v.title,
      meta: `${sp}${n ? ` · الدرس ${n}` : ''} · بقي ${Math.ceil(remain / 60)} دقيقة`,
      progress: v.duration ? p.pos / v.duration : 0,
    };
  }, [progress, videos.data, series.data, persons.data]);

  const loading = persons.loading || videos.loading || series.loading;

  return (
    <Page>
      <TopBar search={{ value: q }} onSearch={setQ} placeholder="اسم الشيخ" />
      <div className="grid">
        {loading && <Empty>…</Empty>}
        {!loading &&
          filtered.map((s, i) => (
            <Link key={s.person.id} className="sh" to={`/tube/sheikh/${s.person.id}`} style={{ ['--i' as string]: i }}>
              <span className="pt">
                {ring}
                <span className="ph">
                  {initial(s.person.name)}
                  {s.person.photo && <img loading="lazy" src={s.person.photo} alt="" onError={(e) => e.currentTarget.remove()} />}
                </span>
              </span>
              <span className="nm">{s.person.name}</span>
              <span className="mt">
                {s.hours > 0
                  ? hoursLabel(s.hours)
                  : s.series > 0
                    ? plural3(s.series, 'سلسلة', 'سلسلتان', 'سلاسل', 'سلسلة')
                    : plural3(s.free, 'درس', 'درسان', 'دروس', 'درساً')}
              </span>
            </Link>
          ))}
        {!loading && !filtered.length && <Empty>لا يوجد شيخ بهذا الاسم</Empty>}
      </div>
      {resume && <ResumeCard {...resume} />}
    </Page>
  );
}
