import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import Heading from '../../components/heading';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import useRoute from '../../hooks/use-route';
import useTranslator from '../../hooks/useTranslator';
import { cn } from '../../lib/utils';
import { type NavItem } from '../../types';

export default function SettingsLayout({ children }: PropsWithChildren) {
  const { __ } = useTranslator();
  const route = useRoute();
  const { hewcode } = usePage().props as any;
  const features = hewcode?.panel?.features || {};

  const allNavItems: NavItem[] = [
    {
      title: 'Profile',
      href: route('panel::profile.edit'),
      icon: null,
      enabled: features.profileSettings !== false,
    },
    {
      title: 'Password',
      href: route('panel::password.edit'),
      icon: null,
      enabled: features.passwordSettings !== false,
    },
    {
      title: 'Appearance',
      href: route('panel::appearance.edit'),
      icon: null,
      enabled: features.appearanceSettings !== false,
    },
  ];

  const sidebarNavItems = allNavItems.filter((item) => item.enabled);

  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading title={__('hewcode.settings.title')} description={__('hewcode.settings.description')} />

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-x-0 space-y-1">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                })}
              >
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
