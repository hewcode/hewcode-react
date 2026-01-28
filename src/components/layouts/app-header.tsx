import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Menu, Search } from 'lucide-react';
import { useHewcode } from '../../contexts/hewcode-context';
import { useInitials } from '../../hooks/use-initials';
import useRoute from '../../hooks/use-route';
import useTranslator from '../../hooks/useTranslator';
import { cn } from '../../lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Icon } from '../icon-registry';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { Breadcrumbs } from './breadcrumbs';
import { UserMenuContent } from './user-menu-content';

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

// Recursive dropdown menu item component
function NavDropdownItem({ item }: { item: NavItem }) {
  const page = usePage();

  // If item has sub-items, render as submenu
  if (item.items && item.items.length > 0) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} className="mr-2" />}
          {item.label}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {item.items.map((subItem) => (
            <NavDropdownItem key={subItem.label} item={subItem} />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  // Regular menu item with link
  return (
    <DropdownMenuItem asChild>
      <Link href={item.url || '#'} className="cursor-pointer">
        {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} className="mr-2" />}
        {item.label}
      </Link>
    </DropdownMenuItem>
  );
}

// Mobile sheet menu item component (recursive)
function MobileNavItem({ item }: { item: NavItem }) {
  // If item has sub-items, render with sub-items indented
  if (item.items && item.items.length > 0) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 font-semibold text-neutral-500">
          {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={20} />}
          <span>{item.label}</span>
        </div>
        <div className="ml-6 flex flex-col space-y-2">
          {item.items.map((subItem) => (
            <MobileNavItem key={subItem.label} item={subItem} />
          ))}
        </div>
      </div>
    );
  }

  // Regular link item
  return (
    <Link href={item.url || '#'} className="flex items-center space-x-2 font-medium">
      {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={20} />}
      <span>{item.label}</span>
    </Link>
  );
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const page = usePage<SharedData>();
  const { auth } = page.props.hewcode as any;
  const { hewcode } = useHewcode();
  const route = useRoute();
  const getInitials = useInitials();
  const { __ } = useTranslator();

  // Get all navigation items (including groups)
  const mainNavItems = hewcode?.panel?.navigation?.items || [];

  // For now, keep right nav items empty - can be configured via hewcode context later
  const rightNavItems = [];

  return (
    <>
      <div className="border-sidebar-border/80 border-b">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                <SheetTitle className="sr-only">{__('hewcode.common.navigation_menu')}</SheetTitle>
                <SheetHeader className="flex justify-start text-left">
                  <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                  <div className="flex h-full flex-col justify-between text-sm">
                    <div className="flex flex-col space-y-4">
                      {mainNavItems.map((item) => (
                        <MobileNavItem key={item.label} item={item} />
                      ))}
                    </div>

                    <div className="flex flex-col space-y-4">
                      {rightNavItems.map((item) => (
                        <a
                          key={item.label}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 font-medium"
                        >
                          {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={20} />}
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href={route('panel::dashboard')} prefetch className="flex items-center space-x-2">
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
            <NavigationMenu className="flex h-full items-stretch">
              <NavigationMenuList className="flex h-full items-stretch space-x-2">
                {mainNavItems.map((item, index) => {
                  // If item has sub-items, render as dropdown
                  if (item.items && item.items.length > 0) {
                    return (
                      <NavigationMenuItem key={index} className="relative flex h-full items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(
                              navigationMenuTriggerStyle(),
                              'h-9 cursor-pointer px-3',
                            )}
                          >
                            {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} className="mr-2" />}
                            {item.label}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {item.items.map((subItem) => (
                              <NavDropdownItem key={subItem.label} item={subItem} />
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </NavigationMenuItem>
                    );
                  }

                  // Regular item with link
                  return (
                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                      <Link
                        href={item.url || '#'}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          item.url && page.url.startsWith(item.url) && activeItemStyles,
                          'h-9 cursor-pointer px-3',
                        )}
                      >
                        {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={16} className="mr-2" />}
                        {item.label}
                      </Link>
                      {item.url && page.url.startsWith(item.url) && (
                        <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                      )}
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
              </Button>
              <div className="hidden lg:flex">
                {rightNavItems.map((item) => (
                  <TooltipProvider key={item.label} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <span className="sr-only">{item.label}</span>
                          {item.icon && <Icon icon={item.icon} fallbackComponent={item.icon} size={20} className="opacity-80 group-hover:opacity-100" />}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-10 rounded-full p-1">
                  <Avatar className="size-8 overflow-hidden rounded-full">
                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                      {getInitials(auth.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <UserMenuContent user={auth.user} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {breadcrumbs.length > 1 && (
        <div className="border-sidebar-border/70 flex w-full border-b">
          <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  );
}
