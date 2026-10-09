import { useParams } from 'react-router-dom';
import { Empty, Page, TopBar } from '../../../ui/AppShell';

export default function SheikhPage() {
  const { id } = useParams();
  return (
    <Page>
      <TopBar />
      <Empty>صفحة الشيخ {id} — المرحلة 1.</Empty>
    </Page>
  );
}
