import { router } from '@inertiajs/react';
import { useState } from 'react';
import ActionModal from '../../components/actions/action-modal.jsx';
import useModalManager from '../../hooks/use-modal-manager.jsx';
import useRoute from '../../hooks/use-route.ts';
import useFetch from '../../hooks/useFetch.js';
import useTranslator from '../../hooks/useTranslator.js';
import { Icon } from '../icon-registry.jsx';
import { Button } from '../ui/button.jsx';

const colorMap = {
  primary: 'default',
  warning: 'destructive',
  secondary: 'secondary',
  success: 'default',
  danger: 'destructive',
};

export default function Action({
  seal,
  path,
  name,
  label,
  modalHeading,
  modalDescription,
  modalWidth,
  requiresConfirmation,
  color = 'primary',
  context = {},
  args = {},
  additionalArgs = {},
  mountsModal = false,
  onStart,
  onSuccess,
  onError,
  onFinish,
  url,
  openInNewTab = false,
  icon,
}) {
  const [loading, setLoading] = useState(false);
  const modal = useModalManager();
  const { __ } = useTranslator();
  const { fetch } = useFetch();
  const route = useRoute();

  const submit = async () => {
    setLoading(true);

    if (onStart) {
      onStart();
    }

    if (mountsModal) {
      modal.component(ActionModal, {
        seal,
        context,
        path,
        name,
        modalHeading,
        modalDescription,
        modalWidth,
        args: {
          ...args,
          ...additionalArgs,
        },
        onSuccess,
        onError,
        onFinish,
      });

      setLoading(false);
    } else {
      fetch(
        route('hewcode.mount'),
        {
          method: 'POST',
          body: {
            seal,
            context,
            call: {
              name: 'mount',
              params: {
                name: path,
                args: {
                  ...args,
                  ...additionalArgs,
                },
              },
            },
          },
          onSuccess: (response) => {
            setLoading(false);

            if (onSuccess) {
              onSuccess(response);
            }

            router.get(window.location.href, {}, { preserveScroll: true });
          },
          onError: (serverErrors) => {
            setLoading(false);

            if (onError) {
              onError(serverErrors);
            }
          },
          onFinish: () => {
            setLoading(false);

            if (onFinish) {
              onFinish();
            }
          },
        },
        true,
      );
    }
  };

  const handleClick = async () => {
    if (requiresConfirmation) {
      const confirmed = await modal.confirm();

      if (!confirmed) {
        return;
      }
    }

    await submit();
  };

  if (!seal) {
    return null;
  }

  return (
    <Button
      variant={colorMap[color] || 'default'}
      onClick={!url ? handleClick : undefined}
      disabled={loading}
      asLink={!!url}
      href={url ? url : undefined}
      target={url && openInNewTab ? '_blank' : undefined}
      rel={url && openInNewTab ? 'noopener noreferrer' : undefined}
      data-action-name={name}
      data-record-id={context?.recordId}
      type="button"
    >
      {icon && <Icon icon={icon} size={16} className="" />}
      {loading ? __('hewcode.common.loading') : label || name}
    </Button>
  );
}
