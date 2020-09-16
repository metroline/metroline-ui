import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';
import styles from './StatusIndicator.module.scss';
import { getStatusIcon } from './get-status-icon';
import { PipelineJobStatus, PipelineStatus } from '../pipelines/types/pipeline';

export function StatusIndicator({ status = 'unknown' }: {
  status: PipelineStatus | PipelineJobStatus | string;
}) {
  const { icon, spin } = getStatusIcon(status);
  return (
    <div className={classNames(styles.status, styles[`status-${status}`])}>
      {icon && (
      <FontAwesomeIcon icon={icon} spin={spin} />
      )}
    </div>
  );
}
