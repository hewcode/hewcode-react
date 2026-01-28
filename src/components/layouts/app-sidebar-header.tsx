import { type ReactNode } from 'react';
import { type BreadcrumbItem as BreadcrumbItemType } from '../../types';
import { SidebarTrigger } from '../ui/sidebar';
import { Breadcrumbs } from './breadcrumbs';

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItemType[];
  actions?: ReactNode[];
  header?: ReactNode;
}

export function AppSidebarHeader({ breadcrumbs = [], actions, header }: AppSidebarHeaderProps) {
  return (
    <header className="border-sidebar-border/50 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 transition-[width,height] ease-linear md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        {header && <div className="ml-4">{header}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
