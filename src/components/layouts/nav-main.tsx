import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { type NavItem } from '../../types';
import { Icon } from '../icon-registry';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar';

function NavMenuItem({ item }: { item: NavItem }) {
  const page = usePage();

  // If item has sub-items, render as collapsible
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible asChild defaultOpen={!item.collapsed} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={{ children: item.label }}>
              {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} />}
              <span>{item.label}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <NavSubMenuItem key={subItem.label} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Regular item with link
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={item.url ? page.url.startsWith(item.url) : false} tooltip={{ children: item.label }}>
        <Link href={item.url || '#'} prefetch>
          {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavSubMenuItem({ item }: { item: NavItem }) {
  const page = usePage();

  // If sub-item has its own sub-items, render as nested collapsible
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible asChild defaultOpen={!item.collapsed} className="group/collapsible">
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton>
              {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} />}
              <span>{item.label}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <NavSubMenuItem key={subItem.label} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  // Regular sub-item with link
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={item.url ? page.url.startsWith(item.url) : false}>
        <Link href={item.url || '#'} prefetch>
          {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
  return (
    <>
      {items.map((item) => {
        // Check if this is a group (has nested items)
        if (item.items && item.items.length > 0) {
          return (
            <SidebarGroup key={item.label} className="px-2 py-0">
              <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <NavMenuItem key={subItem.label} item={subItem} />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          );
        }

        // This is a standalone item (not a group)
        return (
          <SidebarGroup key={item.label} className="px-2 py-0">
            <SidebarMenu>
              <NavMenuItem item={item} />
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}
