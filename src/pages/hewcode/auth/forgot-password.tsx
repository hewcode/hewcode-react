// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '../../../components/input-error';
import TextLink from '../../../components/text-link';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AuthLayout from '../../../layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <AuthLayout title={__('hewcode.auth.forgot_password')} description={__('hewcode.auth.enter_email_for_reset')}>
      <Head title={__('hewcode.auth.forgot_password')} />

      {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

      <div className="space-y-6">
        <Form action={route('panel::password.email')} method="post">
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">{__('hewcode.auth.email_address')}</Label>
                <Input id="email" type="email" name="email" autoComplete="off" autoFocus placeholder="email@example.com" />

                <InputError message={errors.email} />
              </div>

              <div className="my-6 flex items-center justify-start">
                <Button className="w-full" disabled={processing} data-test="email-password-reset-link-button">
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Email password reset link
                </Button>
              </div>
            </>
          )}
        </Form>

        <div className="text-muted-foreground space-x-1 text-center text-sm">
          <span>{__('hewcode.auth.or_return_to')}</span>
          <TextLink href={route('panel::login')}>{__('hewcode.auth.log_in')}</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
