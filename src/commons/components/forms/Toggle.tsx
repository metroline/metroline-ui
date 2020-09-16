import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Toggle.module.scss';

export function Toggle({
  value,
  onChange,
  togglePosition = 'right',
  disabled,
  children,
}: {
  value?: boolean;
  onChange?: (value: boolean) => void;
  togglePosition?: 'left' | 'right';
  disabled?: boolean;
  children?: any;
}) {
  const [isOn, setIsOn] = useState<boolean>();

  const toggle = () => {
    if (disabled) {
      return;
    }
    setIsOn(!isOn);
    if (onChange) {
      onChange(!isOn);
    }
  };

  useEffect(() => {
    setIsOn(!!value);
  }, [value]);

  const icon = (
    <div className={classNames(styles.icon, { [styles.on]: isOn })}>
      <div className={`${styles['bg-on']} ${styles.bg}`} />
      <div className={`${styles['bg-off']} ${styles.bg}`} />
      <div className={styles.knob} />
    </div>
  );

  return (
    <div
      className={classNames('d-flex align-items-center cursor-pointer', { [styles.disabled]: disabled })}
      onClick={toggle}
    >
      {togglePosition === 'left' ? (
        <>
          {icon}
          <div className={`ml-3 ${styles.label}`}>{children}</div>
        </>
      ) : (
        <>
          <div className={`ml-3 ${styles.label}`}>{children}</div>
          {icon}
        </>
      )}
    </div>
  );
}
