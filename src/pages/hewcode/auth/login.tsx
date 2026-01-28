import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '../../../components/input-error';
import TextLink from '../../../components/text-link';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AuthLayout from '../../../layouts/auth-layout';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <AuthLayout title={__('hewcode.auth.log_in_to_your_account')} description={__('hewcode.auth.enter_credentials_to_log_in')}>
      <Head title={__('hewcode.auth.log_in')} />

      <Form action={route('panel::login.store')} method="post" resetOnSuccess={['password']} className="flex flex-col gap-6">
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{__('hewcode.auth.email_address')}</Label>
                <Input id="email" type="email" name="email" required autoFocus tabIndex={1} autoComplete="email" placeholder="email@example.com" />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{__('hewcode.auth.password')}</Label>
                  {canResetPassword && (
                    <TextLink href={route('panel::password.request')} className="ml-auto text-sm" tabIndex={5}>
                      {__('hewcode.auth.forgot_password_question')}
                    </TextLink>
                  )}
                </div>
                <Input id="password" type="password" name="password" required tabIndex={2} autoComplete="current-password" placeholder={__('hewcode.auth.password')} />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="remember" tabIndex={3} />
                <Label htmlFor="remember">{__('hewcode.auth.remember_me')}</Label>
              </div>

              <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing} data-test="login-button">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {__('hewcode.auth.log_in')}
              </Button>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              Don't have an account?{' '}
              <TextLink href={route('panel::register')} tabIndex={5}>
                {__('hewcode.auth.sign_up')}
              </TextLink>
            </div>
          </>
        )}
      </Form>

      {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
    </AuthLayout>
  );
}
