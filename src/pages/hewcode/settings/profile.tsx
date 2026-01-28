import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '../../../types';

import HeadingSmall from '../../../components/heading-small';
import InputError from '../../../components/input-error';
import DeleteUser from '../../../components/layouts/delete-user';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AppLayout from '../../../layouts/app-layout';
import SettingsLayout from '../../../layouts/settings/layout';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;
  const route = useRoute();
  const { __ } = useTranslator();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: __('hewcode.settings.profile_settings'),
      href: route('panel::profile.edit'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('hewcode.settings.profile_settings')} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title={__('hewcode.settings.profile_information')} description={__('hewcode.settings.profile_information_description')} />

          <Form
            action={route('panel::profile.update')}
            method="post"
            options={{
              preserveScroll: true,
            }}
            className="space-y-6"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>

                  <Input
                    id="name"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.name}
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Full name"
                  />

                  <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{__('hewcode.auth.email_address')}</Label>

                  <Input
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.email}
                    name="email"
                    required
                    autoComplete="username"
                    placeholder={__('hewcode.auth.email_address')}
                  />

                  <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && auth.user.email_verified_at === null && (
                  <div>
                    <p className="text-muted-foreground -mt-4 text-sm">
                      Your email address is unverified.{' '}
                      <Link
                        href={route('panel::verification.send')}
                        as="button"
                        className="text-foreground hover:decoration-current! underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out dark:decoration-neutral-500"
                      >
                        {__('hewcode.settings.resend_verification_email')}
                      </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                      <div className="mt-2 text-sm font-medium text-green-600">{__('hewcode.settings.verification_link_sent')}</div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button disabled={processing} data-test="update-profile-button">
                    Save
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-neutral-600">Saved</p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
