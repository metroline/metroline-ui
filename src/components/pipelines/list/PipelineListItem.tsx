import moment from 'moment';
import React from 'react';
import styles from './PipelineListItem.module.scss';
import { LivePipelineStatus } from '../LivePipelineStatus';
import { Commit } from '../../../commons/components/Commit';

export function PipelineListItem({ pipeline }: { pipeline }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.time} flex-shrink-0`}>{moment(pipeline.createdAt).fromNow()}</div>
      <div className={styles.body}>
        <div className={`d-flex align-items-center ${styles['status-and-message-container']}`}>
          <div className={styles.line} />
          <LivePipelineStatus pipelineId={pipeline._id} pipelineStatus={pipeline.status} />
          <span className={`ml-3 ${styles['commit-message']}`}>{pipeline.commit.message}</span>
        </div>
        <div className={styles.commit}>
          <Commit commit={pipeline.commit} />
        </div>
      </div>
    </div>
  );
}
