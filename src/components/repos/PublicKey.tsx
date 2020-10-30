import React, { useState } from 'react';
import { AppModal } from '../../commons/components/AppModal';
import { CodeSnippet } from '../../commons/components/CodeSnippet';

export function PublicKey({ publicKey, children }: {
  publicKey: string;
  children: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <AppModal
        open={isOpen}
        title="Repo public key"
        closeModal={close}
      >
        <p>Metroline uses the following public key to authenticate with your Git server:</p>
        <CodeSnippet>{publicKey}</CodeSnippet>
      </AppModal>
      <div onClick={open}>
        {children}
      </div>
    </>
  );
}
