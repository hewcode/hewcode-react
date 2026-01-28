import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import useRoute from '../../hooks/use-route';
import useTranslator from '../../hooks/useTranslator';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import HeadingSmall from './heading-small';
import InputError from './input-error';

export default function DeleteUser() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const route = useRoute();
  const { __ } = useTranslator();

  return (
    <div className="space-y-6">
      <HeadingSmall title={__('hewcode.settings.delete_account')} description={__('hewcode.settings.delete_account_description')} />
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Warning</p>
          <p className="text-sm">{__('hewcode.settings.proceed_with_caution')}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" data-test="delete-user-button">
              {__('hewcode.settings.delete_account')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{__('hewcode.settings.are_you_sure_delete_account')}</DialogTitle>
            <DialogDescription>
              {__('hewcode.settings.delete_account_confirmation')}
            </DialogDescription>

            <Form
              action={route('panel::profile.destroy')}
              method="post"
              options={{
                preserveScroll: true,
              }}
              onError={() => passwordInput.current?.focus()}
              resetOnSuccess
              className="space-y-6"
            >
              {({ resetAndClearErrors, processing, errors }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="sr-only">
                      {__('hewcode.auth.password')}
                    </Label>

                    <Input id="password" type="password" name="password" ref={passwordInput} placeholder={__('hewcode.auth.password')} autoComplete="current-password" />

                    <InputError message={errors.password} />
                  </div>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="secondary" onClick={() => resetAndClearErrors()}>
                        {__('hewcode.common.cancel')}
                      </Button>
                    </DialogClose>

                    <Button variant="destructive" disabled={processing} asChild>
                      <button type="submit" data-test="confirm-delete-user-button">
                        {__('hewcode.settings.delete_account')}
                      </button>
                    </Button>
                  </DialogFooter>
                </>
              )}
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
