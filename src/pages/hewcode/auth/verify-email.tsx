// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '../../../components/text-link';
import { Button } from '../../../components/ui/button';
import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AuthLayout from '../../../layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <AuthLayout title={__('hewcode.auth.verify_email')} description={__('hewcode.auth.verify_email_description')}>
      <Head title={__('hewcode.auth.email_verification')} />

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {__('hewcode.settings.verification_link_sent')}
        </div>
      )}

      <Form action={route('panel::verification.send')} method="post" className="space-y-6 text-center">
        {({ processing }) => (
          <>
            <Button disabled={processing} variant="secondary">
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {__('hewcode.settings.resend_verification_email')}
            </Button>

            <TextLink href={route('panel::logout')} className="mx-auto block text-sm">
              {__('hewcode.auth.log_out')}
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
