import React from 'react';
import { useHewcode } from '../contexts/hewcode-context.tsx';
import useToastManager from '../hooks/use-toast-manager.jsx';
import fireToasts from '../utils/fire-toasts.js';

export default function App({ children }) {
  const { toasts } = useHewcode().hewcode;
  const { toast } = useToastManager();

  React.useEffect(() => {
    if (toasts.length > 0) {
      fireToasts(toasts, toast);
    }
  }, [toasts, toast]);

  return children;
}
