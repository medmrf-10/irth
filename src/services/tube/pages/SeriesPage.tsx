import { useParams } from 'react-router-dom';
import { Empty, Header, Page } from '../../../ui/AppShell';

export default function SeriesPage() {
  const { id } = useParams();
  return (
    <Page>
      <Header title="السلسلة" />
      <Empty>صفحة السلسلة {id} — المرحلة 1.</Empty>
    </Page>
  );
}
