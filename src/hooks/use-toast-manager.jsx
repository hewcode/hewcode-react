import { toast } from 'sonner';
import useTranslator from './useTranslator.js';

export default function useToastManager() {
  const { __ } = useTranslator();

  const toastManager = {
    toast,

    success: (message = __('app.toasts.success')) => {
      toast.success(message);
    },

    danger: (message = __('app.toasts.error')) => {
      toast.error(message);
    },

    warning: (message = __('app.toasts.warning')) => {
      toast.warning(message);
    },

    info: (message = __('app.toasts.info')) => {
      toast.info(message);
    },

    // For backward compatibility with base-ui API
    add: ({ description, type }) => {
      switch (type) {
        case 'success':
          toast.success(description);
          break;
        case 'danger':
          toast.error(description);
          break;
        case 'warning':
          toast.warning(description);
          break;
        case 'info':
          toast.info(description);
          break;
        default:
          toast(description);
      }
    },
  };

  return toastManager;
}
