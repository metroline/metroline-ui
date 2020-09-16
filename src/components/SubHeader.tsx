import React from 'react';
import styles from './SubHeader.module.scss';

export function SubHeader({ children, className }: { children?: any; className: string }) {
  return <div className={`${styles['sub-header']}${className ? ` ${className}` : ''}`}>{children}</div>;
}
