import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Modal from 'react-modal';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './AppModal.module.scss';

export type AppModalProps = {
  open: boolean;
  title: string;
  children: any;
  footer?: any;
  closeModal?: () => void;
  [key: string]: any;
};

export function AppModal({
  title,
  children,
  open,
  closeModal,
  footer,
  ...otherProps
}: AppModalProps) {
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal || (() => undefined)}
      className={styles.container}
      overlayClassName={styles.overlay}
      {...otherProps}
    >
      <button className={styles['close-button']} type="button">
        <FontAwesomeIcon icon={faTimes} onClick={() => closeModal()} />
      </button>
      <div className="card">
        <div className="card-header">{title}</div>
        <div className={`card-body ${styles.content}`}>{children}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </Modal>
  );
}
