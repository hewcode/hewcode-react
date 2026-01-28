import { useCallback } from 'react';
import { useModalContext } from '../contexts/modal-context';

const useModalManager = () => {
  const { modals, openModal, closeModal, closeAll } = useModalContext();

  const custom = useCallback(
    (props = {}) => {
      return new Promise((resolve) => {
        const id = openModal({
          type: 'custom',
          props: {
            ...props,
            onClose: () => {
              props.onClose?.();
              closeModal(id);
              resolve();
            },
          },
        });
      });
    },
    [openModal, closeModal],
  );

  const component = useCallback(
    (Component, props = {}) => {
      return new Promise((resolve) => {
        const id = openModal({
          type: 'component',
          component: Component,
          props: {
            ...props,
            onClose: () => {
              props.onClose?.();
              closeModal(id);
              resolve();
            },
          },
        });
      });
    },
    [openModal, closeModal],
  );

  const confirm = useCallback(
    (props = {}) => {
      return new Promise((resolve) => {
        const id = openModal({
          type: 'confirmation',
          props: {
            ...props,
            onConfirm: () => {
              props.onConfirm?.();
              closeModal(id);
              resolve(true);
            },
            onCancel: () => {
              props.onCancel?.();
              closeModal(id);
              resolve(false);
            },
            onClose: () => {
              props.onClose?.();
              closeModal(id);
              resolve(false);
            },
          },
        });
      });
    },
    [openModal, closeModal],
  );

  return {
    confirm,
    custom,
    component,
    closeAll,
    hasModals: modals.length > 0,
    // render is no longer needed as modals are rendered centrally
  };
};

export default useModalManager;
