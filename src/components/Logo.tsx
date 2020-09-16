/* eslint-disable max-len */
import React from 'react';
import MetrolineLogo from '../assets/images/metroline-logo-inverted.svg';
import styles from './Logo.module.scss';

export function Logo() {
  return (
    <div className={styles.logo}>
      <img src={MetrolineLogo} alt="metroline-logo" />
    </div>
  );
}
