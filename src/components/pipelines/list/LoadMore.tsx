import React from 'react';
import styles from './LoadMore.module.scss';

export function LoadMore({ onClick }: { onClick: (e: any) => void }) {
  return (
    <>
      <button type="button" className={styles.button} onClick={onClick}>
        Load more
      </button>
    </>
  );
}
