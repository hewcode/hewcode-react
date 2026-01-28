import { type PropsWithChildren, type ReactNode } from 'react';
import { AppContent } from '../../components/layouts/app-content';
import { AppShell } from '../../components/layouts/app-shell';
import { AppSidebar } from '../../components/layouts/app-sidebar';
import { AppSidebarHeader } from '../../components/layouts/app-sidebar-header';
import { type BreadcrumbItem } from '../../types';

interface AppSidebarLayoutProps {
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode[];
  header?: ReactNode;
}

export default function AppSidebarLayout({ children, breadcrumbs = [], actions, header }: PropsWithChildren<AppSidebarLayoutProps>) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <AppContent variant="sidebar" className="overflow-x-hidden">
        <AppSidebarHeader breadcrumbs={breadcrumbs} actions={actions} header={header} />
        {children}
      </AppContent>
    </AppShell>
  );
}
