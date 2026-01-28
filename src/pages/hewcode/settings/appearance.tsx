import { Head } from '@inertiajs/react';

import HeadingSmall from '../../../components/heading-small';
import AppearanceTabs from '../../../components/layouts/appearance-tabs';
import { type BreadcrumbItem } from '../../../types';

import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AppLayout from '../../../layouts/app-layout';
import SettingsLayout from '../../../layouts/settings/layout';

export default function Appearance() {
  const route = useRoute();
  const { __ } = useTranslator();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: __('hewcode.settings.appearance_settings'),
      href: route('panel::appearance.edit'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={__('hewcode.settings.appearance_settings')} />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title={__('hewcode.settings.appearance_settings')} description={__('hewcode.settings.appearance_settings_description')} />
          <AppearanceTabs />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
