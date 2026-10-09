import { useParams, useSearchParams } from 'react-router-dom';
import { Empty, Page, TopBar } from '../../../ui/AppShell';

export default function LessonPage() {
  const { videoId } = useParams();
  const [search] = useSearchParams();
  const seriesId = search.get('s');
  return (
    <Page>
      <TopBar />
      <Empty>
        الدرس {videoId}
        {seriesId ? ` في سلسلة ${seriesId}` : ''} — قلب التطبيق، المرحلة 2.
      </Empty>
    </Page>
  );
}
