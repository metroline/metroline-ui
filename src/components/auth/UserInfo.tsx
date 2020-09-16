import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import styles from './UserInfo.module.scss';

export function UserInfo({ className, ...props }: { className?: string; [key: string]: any }) {
  const { user } = useAuth();
  return user ? (
    <div className={`${styles.info}${className ? ` ${className}` : ''}`} {...props}>
      <span className={styles.name}>{user.name.substr(0, 1).toUpperCase()}</span>
    </div>
  ) : (
    <></>
  );
}
