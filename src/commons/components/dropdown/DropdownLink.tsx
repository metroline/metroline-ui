import { Link } from 'react-router-dom';
import React from 'react';
import styles from './DropdownLink.module.scss';

export function DropdownLink({ to, children, icon, onClick }: { to?: string; onClick?: (e?) => void; children: any; icon?: any }) {
  const content = (
    <>
      <div className="mr-2">
        {icon || (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="10" fill="#EEECF9" />
          </svg>
        )}
      </div>
      {children}
    </>
  );
  return to ? (
    <Link className={styles.link} to={to}>
      {content}
    </Link>
  ) : (
    <span className={styles.link} onClick={onClick}>
      {content}
    </span>
  );
}
