import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '../../../components/input-error';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import useRoute from '../../../hooks/use-route';
import useTranslator from '../../../hooks/useTranslator';
import AuthLayout from '../../../layouts/auth-layout';

export default function ConfirmPassword() {
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <AuthLayout title={__('hewcode.auth.confirm_your_password')} description={__('hewcode.auth.secure_area_description')}>
      <Head title={__('hewcode.auth.confirm_password')} />

      <Form action={route('panel::password.confirm.store')} method="post" resetOnSuccess={['password']}>
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password">{__('hewcode.auth.password')}</Label>
              <Input id="password" type="password" name="password" placeholder={__('hewcode.auth.password')} autoComplete="current-password" autoFocus />

              <InputError message={errors.password} />
            </div>

            <div className="flex items-center">
              <Button className="w-full" disabled={processing} data-test="confirm-password-button">
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {__('hewcode.auth.confirm_password')}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
