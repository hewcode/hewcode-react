import { useModalContext } from '../contexts/modal-context';
import ConfirmationModal from './confirmation-modal';
import Modal from './modal';

export function ModalRenderer() {
  const { modals } = useModalContext();

  return (
    <>
      {modals.map((modal) => {
        if (modal.type === 'confirmation') {
          return <ConfirmationModal key={modal.id} {...modal.props} />;
        }
        if (modal.type === 'custom') {
          const { children, ...modalProps } = modal.props;
          return (
            <Modal key={modal.id} {...modalProps}>
              {children}
            </Modal>
          );
        }
        if (modal.type === 'component') {
          const Component = modal.component!;
          return <Component key={modal.id} {...modal.props} />;
        }
        return null;
      })}
    </>
  );
}
