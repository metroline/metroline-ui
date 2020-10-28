import React from 'react';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div>
          <a href="https://docs.metroline.io" className={styles.link} target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
          <a href="https://github.com/metroline/metroline" className={styles.link} target="_blank" rel="noopener noreferrer">
            Github
          </a>
          <a href="https://github.com/metroline/metroline/blob/master/LICENSE" className={styles.link} target="_blank" rel="noopener noreferrer">
            License
          </a>
        </div>
        <div className="text-muted d-flex align-items-center">
          <span>
            v
            {process.env.REACT_APP_VERSION}
          </span>
        </div>
      </footer>
    </>
  );
}
