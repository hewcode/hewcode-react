import { usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '../../components/ui/placeholder-pattern';
import Widgets from '../../components/widgets/Widgets';
import useRoute from '../../hooks/use-route';
import PageLayout from '../../layouts/pages/page-layout';
import { type BreadcrumbItem } from '../../types';

export default function Dashboard() {
  const route = useRoute();
  const { widgets } = usePage().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: route('panel::dashboard'),
    },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <Widgets {...widgets} />

      {widgets.length > 1 && (
        <div className="mt-4 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
          </div>
          <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[45vh] flex-1 overflow-hidden rounded-xl border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
