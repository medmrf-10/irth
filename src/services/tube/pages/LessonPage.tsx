import { useParams, useSearchParams } from 'react-router-dom';
import { Empty, Header, Page } from '../../../ui/AppShell';

export default function LessonPage() {
  const { videoId } = useParams();
  const [search] = useSearchParams();
  const seriesId = search.get('s'); // رمز السلسلة يحدد رقم الدرس والتالي/السابق
  return (
    <Page>
      <Header title="الدرس" />
      <Empty>
        الدرس {videoId}
        {seriesId ? ` في سلسلة ${seriesId}` : ''} — قلب التطبيق، المرحلة 2.
      </Empty>
    </Page>
  );
}
