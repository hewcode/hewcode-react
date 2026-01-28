import { usePage } from '@inertiajs/react';
import Listing from '../../../components/data-table/Listing';
import PageLayout from '../../../layouts/pages/page-layout';

export default function Index() {
  const { listing } = usePage().props;

  return (
    <PageLayout>
      <Listing {...listing} />
    </PageLayout>
  );
}
