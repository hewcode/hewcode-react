import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { useMobileNavigation } from '../../hooks/use-mobile-navigation';
import useRoute from '../../hooks/use-route';
import useTranslator from '../../hooks/useTranslator';
import { type User } from '../../types';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { UserInfo } from './user-info';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();
  const route = useRoute();
  const { __ } = useTranslator();
  const { hewcode } = usePage().props as any;
  const features = hewcode?.panel?.features || {};

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  const hasAnySettings = features.profileSettings !== false || features.passwordSettings !== false || features.appearanceSettings !== false;

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      {hasAnySettings && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link className="block w-full" href={route('panel::settings')} as="button" prefetch onClick={cleanup}>
                <Settings className="mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link className="block w-full" href={route('panel::logout')} as="button" onClick={handleLogout} data-test="logout-button">
          <LogOut className="mr-2" />
          {__('hewcode.auth.log_out')}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
