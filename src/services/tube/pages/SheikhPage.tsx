import { useParams } from 'react-router-dom';
import { Empty, Header, Page } from '../../../ui/AppShell';

export default function SheikhPage() {
  const { id } = useParams();
  return (
    <Page>
      <Header title="الشيخ" />
      <Empty>صفحة الشيخ {id} — المرحلة 1.</Empty>
    </Page>
  );
}
