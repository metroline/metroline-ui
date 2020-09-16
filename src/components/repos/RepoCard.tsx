import moment from 'moment';
import React from 'react';
import { Commit } from '../../commons/components/Commit';
import { LivePipelineStatus } from '../pipelines/LivePipelineStatus';
import { StatusIndicator } from '../status/StatusIndicator';
import { useRepoPipeline } from './live-repo';
import styles from './RepoCard.module.scss';
import { SetupRepo } from './SetupRepo';

export function RepoCard({ repo, latestPipeline }: { repo; latestPipeline }) {
  const [pipeline] = useRepoPipeline(repo._id, latestPipeline);

  return (
    <div className={`${styles.repo} d-flex justify-content-between align-items-center`}>
      <div className="d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center justify-content-between flex-grow-1">
          <div className="d-flex align-items-center">
            {pipeline ? (
              <LivePipelineStatus pipelineId={pipeline._id} pipelineStatus={pipeline.status} />
            ) : (
              <StatusIndicator status={undefined} />
            )}
            <span className="ml-3">{repo.name}</span>
          </div>
          {pipeline && repo.isSetup && (
            <div>
              <span className="text-muted">{moment(pipeline.createdAt).fromNow()}</span>
            </div>
          )}
        </div>
        <div className={styles.commit}>
          {pipeline ? <Commit commit={pipeline.commit} /> : <small className="text-muted">Never built, waiting for commits</small>}
        </div>
      </div>
      {!repo.isSetup && (
        <div>
          <SetupRepo repoId={repo._id} permissions={repo.permissions} />
        </div>
      )}
    </div>
  );
}
