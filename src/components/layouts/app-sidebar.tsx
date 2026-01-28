import { Link } from '@inertiajs/react';
import { useHewcode } from '../../contexts/hewcode-context';
import useRoute from '../../hooks/use-route';
import { type NavItem } from '../../types';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  const { hewcode } = useHewcode();
  const route = useRoute();

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={route('panel::dashboard')} prefetch>
                  <AppLogo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={hewcode?.panel?.navigation?.items || []} />
        </SidebarContent>

        <SidebarFooter>
          <NavFooter items={footerNavItems} className="mt-auto" />
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
