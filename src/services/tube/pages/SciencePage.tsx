// صفحة العلم — سلاسله بصفوف ورق: العنوان + الشيخ والكتاب + العدد والمدة.
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tables } from '../../../data/load';
import { useAsync } from '../../../data/hooks';
import { seriesDuration, seriesSheikh, seriesWork } from '../../../data/derive';
import { hoursLabel } from '../../../lib/duration';
import { plural3 } from '../../../lib/plural';
import { Empty, Page, TopBar } from '../../../ui/AppShell';

const chev = (
  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function SciencePage() {
  const { id } = useParams();
  const sciences = useAsync(tables.sciences);
  const series = useAsync(tables.series);
  const videos = useAsync(tables.videos);
  const persons = useAsync(tables.persons);
  const works = useAsync(tables.works);

  const name = sciences.data?.rows.find((s) => s.id === id)?.name ?? '';

  const rows = useMemo(() => {
    if (!series.data || !videos.data || !persons.data || !works.data) return [];
    const vids = videos.data;
    const pm = new Map(persons.data.rows.map((p) => [p.id, p.short ?? p.name]));
    const wm = new Map(works.data.rows.map((w) => [w.id, w.title]));
    return series.data.rows
      .filter((s) => s.science === id)
      .map((s) => {
        const sh = seriesSheikh(s, vids);
        const wk = seriesWork(s, vids);
        return {
          id: s.id,
          title: s.title,
          lessons: s.items.length,
          hours: seriesDuration(s, vids),
          sheikh: sh ? pm.get(sh) ?? '' : '',
          work: wk ? wm.get(wk) ?? '' : '',
        };
      });
  }, [series.data, videos.data, persons.data, works.data, id]);

  const loading = sciences.loading || series.loading || videos.loading || persons.loading || works.loading;

  return (
    <Page>
      <TopBar />
      <div className="list">
        {loading && <Empty>…</Empty>}
        {!loading &&
          rows.map((r, i) => (
            <Link key={r.id} className="row" to={`/tube/series/${r.id}`} style={{ ['--i' as string]: i }}>
              <span className="ph">{r.title.trim().replace(/^ال/, '')[0]}</span>
              <span className="tx">
                <span className="nm">{r.title}</span>
                <span className="mt">
                  {[r.sheikh, r.work].filter(Boolean).join(' · ')}
                </span>
                <span className="mt">
                  {plural3(r.lessons, 'درس', 'درسان', 'دروس', 'درساً')} · {hoursLabel(r.hours)}
                </span>
              </span>
              {chev}
            </Link>
          ))}
        {!loading && !rows.length && <Empty>لا سلاسل في «{name}» بعد</Empty>}
      </div>
    </Page>
  );
}
