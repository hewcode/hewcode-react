import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { type BreadcrumbItem } from '../types';
import AppHeaderLayout from './app/app-header-layout';
import AppSidebarLayout from './app/app-sidebar-layout';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode[];
  header?: ReactNode;
}

export default ({ children, breadcrumbs, actions, header, ...props }: AppLayoutProps) => {
  const { hewcode } = usePage().props as any;
  const layout = hewcode?.panel?.layout || 'sidebar';

  if (layout === 'header') {
    return (
      <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
      </AppHeaderLayout>
    );
  }

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs} actions={actions} header={header} {...props}>
      {children}
    </AppSidebarLayout>
  );
};
