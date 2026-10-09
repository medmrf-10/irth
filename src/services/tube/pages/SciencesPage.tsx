// معرض العلوم — الرئيسية: قائمة صفوف بأسلوب ورق، كل علم يفتح سلاسله.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { tables } from '../../../data/load';
import { useAsync } from '../../../data/hooks';
import { plural3 } from '../../../lib/plural';
import { Empty, Page, TopBar } from '../../../ui/AppShell';
import { ResumeCard } from '../../../ui/ResumeCard';
import { useUser } from '../../../user/store';

const chev = (
  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function SciencesPage() {
  const sciences = useAsync(tables.sciences);
  const series = useAsync(tables.series);
  const videos = useAsync(tables.videos);
  const persons = useAsync(tables.persons);
  const progress = useUser((s) => s.progress);

  const rows = useMemo(() => {
    if (!sciences.data || !series.data) return [];
    const counts = new Map<string, number>();
    for (const s of series.data.rows) {
      const sc = s.science ?? 'other';
      counts.set(sc, (counts.get(sc) ?? 0) + 1);
    }
    return sciences.data.rows.map((sc) => ({
      id: sc.id,
      name: sc.name,
      count: counts.get(sc.id) ?? 0,
    }));
  }, [sciences.data, series.data]);

  const resume = useMemo(() => {
    if (!videos.data || !series.data || !persons.data) return null;
    const entries = Object.entries(progress).filter(([, p]) => p.pos > 0 && p.done === 0);
    if (!entries.length) return null;
    const [vid, p] = entries.sort((a, b) => b[1].last.localeCompare(a[1].last))[0];
    const v = videos.data.rows.find((x) => x.id === vid);
    if (!v) return null;
    const s = series.data.rows.find((sr) => sr.items.includes(vid));
    const n = s ? s.items.indexOf(vid) + 1 : undefined;
    const remain = Math.max(0, v.duration - p.pos);
    const sp = (v.speakers?.[0] && persons.data.rows.find((x) => x.id === v.speakers![0])?.name) ?? '';
    return {
      videoId: vid,
      seriesQuery: s?.id,
      title: s?.title ?? v.title,
      meta: `${sp}${n ? ` · الدرس ${n}` : ''} · بقي ${Math.ceil(remain / 60)} دقيقة`,
      progress: v.duration ? p.pos / v.duration : 0,
    };
  }, [progress, videos.data, series.data, persons.data]);

  const loading = sciences.loading || series.loading;

  return (
    <Page>
      <TopBar />
      <div className="list">
        {loading && <Empty>…</Empty>}
        {!loading &&
          rows.map((r, i) => (
            <Link key={r.id} className="row" to={`/tube/science/${r.id}`} style={{ ['--i' as string]: i }}>
              <span className="ph">{r.name.trim().replace(/^ال/, '')[0]}</span>
              <span className="tx">
                <span className="nm">{r.name}</span>
                <span className="mt">{plural3(r.count, 'سلسلة', 'سلسلتان', 'سلاسل', 'سلسلة')}</span>
              </span>
              {chev}
            </Link>
          ))}
        {!loading && !rows.length && <Empty>لا علوم بعد</Empty>}
      </div>
      {resume && <ResumeCard {...resume} />}
    </Page>
  );
}
