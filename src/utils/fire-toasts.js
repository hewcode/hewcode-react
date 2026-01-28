export default function fireToasts(toasts, toast) {
  setTimeout(() => {
    toasts.forEach((toastData) => {
      const { type, title, ...options } = toastData;

      switch (type) {
        case 'success':
          toast.success(title, options);
          break;
        case 'warning':
          toast.warning(title, options);
          break;
        case 'info':
          toast.info(title, options);
          break;
        case 'error':
          toast.error(title, options);
          break;
        default:
          toast.message(title, options);
      }
    });
  }, 80);
}
