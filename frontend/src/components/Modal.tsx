import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onCancel}>
      <div className='modal-dialog' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>{title}</h3>
        </div>
        <div className='modal-body'>
          <p>{message}</p>
        </div>
        <div className='modal-footer'>
          <button className='modal-btn modal-btn-cancel' onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`modal-btn ${isDangerous ? 'modal-btn-danger' : 'modal-btn-confirm'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
