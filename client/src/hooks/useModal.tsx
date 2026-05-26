import { useState, useCallback } from 'react';
import { GenericModal, type ModalConfig, type ModalType, type ModalOption } from '../components/common/GenericModal';

export interface ShowModalProps {
  type: ModalType;
  title: string;
  message: string;
  inputType?: 'text' | 'select';
  inputLabel?: string;
  defaultValue?: string;
  options?: ModalOption[];
  confirmText?: string;
  cancelText?: string;
}

export const useModal = () => {
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const showModal = useCallback((props: ShowModalProps): Promise<any> => {
    return new Promise((resolve) => {
      setConfig({
        ...props,
        isOpen: true,
        onConfirm: (data) => {
          setConfig(null);
          // Wait for the modal exit animation (if any) to complete
          setTimeout(() => resolve(data === undefined ? true : data), 50);
        },
        onCancel: () => {
          setConfig(null);
          setTimeout(() => resolve(null), 50);
        },
      });
    });
  }, []);

  const ModalComponent = useCallback(() => <GenericModal config={config} />, [config]);

  return { showModal, ModalComponent };
};
