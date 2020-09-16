import React from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './DropDown.module.scss';

export function dropdownToggle(id: string) {
  return {
    'data-event': 'click',
    'data-for': id,
    'data-tip': 'tooltip',
  };
}

export function Dropdown({ children, id, className, ...props }: { children: any; id: string; className?: string; [key: string]: any }) {
  return (
    <>
      <ReactTooltip
        id={id}
        place="bottom"
        effect="solid"
        className={`${styles.dropdown}${className ? ` ${className}` : ''}`}
        globalEventOff="click"
        eventOff="close-dropdown"
        clickable
        overridePosition={({ left, top }, event, triggerElement, tooltipElement) => ({
          top,
          left: Math.min(left, window.innerWidth - tooltipElement.offsetWidth),
        })}
        {...props}
      >
        {children}
      </ReactTooltip>
    </>
  );
}
