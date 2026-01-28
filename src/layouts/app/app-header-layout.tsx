import type { PropsWithChildren } from 'react';
import { AppContent } from '../../components/layouts/app-content';
import { AppHeader } from '../../components/layouts/app-header';
import { AppShell } from '../../components/layouts/app-shell';
import { type BreadcrumbItem } from '../../types';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent>{children}</AppContent>
    </AppShell>
  );
}
