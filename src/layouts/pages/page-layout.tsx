import { Head, usePage } from '@inertiajs/react';
import Actions from '../../components/actions/Actions';
import AppLayout from '../../layouts/app-layout';

export default function PageLayout({ title: customTitle = null, children }) {
  const { headerActions } = usePage().props;

  const title = customTitle || usePage().props.title || 'Page';

  return (
    <AppLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">{title}</h2>}
      actions={headerActions && <Actions {...headerActions} />}
    >
      <Head title={title} />

      <div className="p-4">{children}</div>
    </AppLayout>
  );
}
