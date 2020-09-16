import moment from 'moment';
import React from 'react';
import styles from './PipelineCard.module.scss';
import { LivePipelineStatus } from './LivePipelineStatus';
import { formatDuration } from './format-duration';
import { usePipelineDuration } from './live-pipeline';
import { Commit } from '../../commons/components/Commit';

export function PipelineCard({ pipeline, raised }: { pipeline; raised? }) {
  const [duration] = usePipelineDuration(pipeline._id, pipeline.duration);

  return (
    <div className={`${styles.pipeline}${raised ? ' raised' : ''}`}>
      <div className="d-flex justify-content-between align-items-center">
        <div className={`d-flex align-items-center ${styles.status}`}>
          <LivePipelineStatus pipelineId={pipeline._id} pipelineStatus={pipeline.status} />
          <span className={`ml-3 ${styles['commit-message']}`}>{pipeline.commit.message}</span>
        </div>
        <div className="flex-shrink-0">
          <span className="text-muted">{moment(pipeline.createdAt).fromNow()}</span>
          {duration && (
          <span className="text-muted">
            {' '}
            -
            {formatDuration(duration[0], duration[1])}
          </span>
          )}
        </div>
      </div>
      <div className={styles.commit}>
        <Commit commit={pipeline.commit} />
      </div>
    </div>
  );
}
