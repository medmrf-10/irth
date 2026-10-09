// بطاقة «أكمل الدرس» العائمة — تظهر فوق الشريط السفلي عند وجود تقدّم مسموع.
import { Link } from 'react-router-dom';
import { IconPlay } from './icons';

export function ResumeCard({
  videoId,
  seriesQuery,
  title,
  meta,
  progress,
}: {
  videoId: string;
  seriesQuery?: string;
  title: string;
  meta: string;
  progress: number; // 0..1 نسبة الإنجاز لعرض الشريط
}) {
  return (
    <Link className="resume" to={`/tube/v/${videoId}${seriesQuery ? `?s=${seriesQuery}` : ''}`}>
      <img src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt="" />
      <span className="rt">
        <b>{title}</b>
        <small>{meta}</small>
      </span>
      <span className="pl">
        <IconPlay />
      </span>
      <i className="bar" style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }} />
    </Link>
  );
}
