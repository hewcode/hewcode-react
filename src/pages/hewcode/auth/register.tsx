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

export default function Register() {
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <AuthLayout title={__('hewcode.auth.create_an_account')} description={__('hewcode.auth.enter_details_to_create_account')}>
      <Head title={__('hewcode.auth.sign_up')} />
      <Form
        action={route('panel::register.store')}
        method="post"
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" required autoFocus tabIndex={1} autoComplete="name" name="name" placeholder="Full name" />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">{__('hewcode.auth.email_address')}</Label>
                <Input id="email" type="email" required tabIndex={2} autoComplete="email" name="email" placeholder="email@example.com" />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">{__('hewcode.auth.password')}</Label>
                <Input id="password" type="password" required tabIndex={3} autoComplete="new-password" name="password" placeholder={__('hewcode.auth.password')} />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">{__('hewcode.auth.confirm_password')}</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  tabIndex={4}
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder={__('hewcode.auth.confirm_password')}
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <Button type="submit" className="mt-2 w-full" tabIndex={5} data-test="register-user-button">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              Already have an account?{' '}
              <TextLink href={route('panel::login')} tabIndex={6}>
                {__('hewcode.auth.log_in')}
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
