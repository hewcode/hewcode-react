import { TriangleAlert } from 'lucide-react';
import useTranslator from '../hooks/useTranslator.js';
import Modal from './modal.jsx';
import { Button } from './ui/button.jsx';

const ConfirmationModal = ({
  variant = 'danger',
  icon: Icon,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  onClose,
  ...props
}) => {
  const { __ } = useTranslator();

  title ||= __('hewcode.confirmation.are_you_sure');
  description ||= __('hewcode.confirmation.this_action_cannot_be_undone');
  Icon ||= TriangleAlert;
  confirmLabel ||= __('hewcode.common.confirm');
  cancelLabel ||= __('hewcode.common.cancel');

  // Color variants for the icon
  const iconColors = {
    primary: 'text-primary-500 dark:text-primary-400',
    success: 'text-success-600 dark:text-success-400',
    sage: 'text-sage-500 dark:text-sage-400',
    danger: 'text-danger-600 dark:text-danger-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-info-600 dark:text-info-400',
    neutral: 'text-gray-600 dark:text-gray-400',
    dark: 'text-gray-900 dark:text-gray-100',
    slate: 'text-slate-600 dark:text-slate-400',
    black: 'text-black dark:text-white',
    default: 'text-gray-500 dark:text-gray-400',
  };

  const iconColorClass = iconColors[variant] || iconColors.danger;

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Modal onClose={onClose} size="sm" {...props}>
      <div className="py-4 text-center">
        {/* Icon */}
        {Icon && (
          <div className="mb-4">
            <Icon className={`mx-auto h-12 w-12 ${iconColorClass}`} />
          </div>
        )}

        {/* Title */}
        {title && <h3 className="mb-2 text-lg font-normal text-gray-900 dark:text-gray-100">{title}</h3>}

        {/* Description */}
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{description}</p>

        {/* Buttons */}
        <div className="space-y-3">
          <Button variant={variant} onClick={handleConfirm} className="w-full">
            {confirmLabel}
          </Button>

          <Button variant="default" onClick={handleCancel} className="w-full">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
