import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ModalData {
  id: string;
  type: 'custom' | 'component' | 'confirmation';
  component?: React.ComponentType<any>;
  props: any;
}

interface ModalContextValue {
  modals: ModalData[];
  openModal: (modal: Omit<ModalData, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalData[]>([]);

  const generateId = () => `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const openModal = useCallback((modal: Omit<ModalData, 'id'>) => {
    const id = generateId();
    const newModal: ModalData = { ...modal, id };
    setModals((prev) => [...prev, newModal]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAll }}>
      {children}
    </ModalContext.Provider>
  );
}