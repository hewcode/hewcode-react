import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '../../../components/input-error';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AuthLayout from '../../../layouts/auth-layout';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <AuthLayout title={__('hewcode.auth.reset_password')} description={__('hewcode.auth.enter_new_password')}>
      <Head title={__('hewcode.auth.reset_password')} />

      <Form
        action={route('panel::password.store')}
        method="post"
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={['password', 'password_confirmation']}
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{__('hewcode.auth.email_address')}</Label>
              <Input id="email" type="email" name="email" autoComplete="email" value={email} className="mt-1 block w-full" readOnly />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{__('hewcode.auth.password')}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                className="mt-1 block w-full"
                autoFocus
                placeholder={__('hewcode.auth.password')}
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">{__('hewcode.auth.confirm_password')}</Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                className="mt-1 block w-full"
                placeholder={__('hewcode.auth.confirm_password')}
              />
              <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={processing} data-test="reset-password-button">
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {__('hewcode.auth.reset_password')}
            </Button>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
