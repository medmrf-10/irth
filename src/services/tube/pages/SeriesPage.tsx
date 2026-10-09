import { useParams } from 'react-router-dom';
import { Empty, Page, TopBar } from '../../../ui/AppShell';

export default function SeriesPage() {
  const { id } = useParams();
  return (
    <Page>
      <TopBar />
      <Empty>صفحة السلسلة {id} — المرحلة 1.</Empty>
    </Page>
  );
}
