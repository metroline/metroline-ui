import React, { useEffect } from 'react';
import moment from 'moment';
import { StatusIndicator } from '../status/StatusIndicator';
import { JobLogs } from './JobLogs';
import { formatDuration } from './format-duration';
import { useJobDuration, useJobStart, useJobStatus } from './live-job';
import { PipelineJob, PipelineJobStatus } from './types/pipeline';

function JobStatus({ jobId, allowFailure, initialValue }: { jobId: string; allowFailure: boolean; initialValue: PipelineJobStatus }) {
  const [status] = useJobStatus(jobId, initialValue);
  return (
    // TODO Differentiating failure and failure+allowFailure is helpful, but is it confusing ?
    <StatusIndicator status={status === 'failure' && allowFailure ? 'partial' : status} />
  );
}

export function Job({ job }: { job: PipelineJob }) {
  const [start, setStart] = useJobStart(job._id);
  const [duration, setDuration] = useJobDuration(job._id);

  useEffect(() => {
    setStart(job.start);
    setDuration(job.duration);
  }, [job, setStart, setDuration]);

  return (
    <div className="job-card card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <JobStatus jobId={job._id} allowFailure={job.allowFailure} initialValue={job.status} />
          <strong className="ml-3">{job.name}</strong>
          <strong className="text-muted ml-3">{job.image}</strong>
          <strong className="text-muted ml-3">{job.bin}</strong>
        </div>
        <div>
          {start && !duration && (
            <span className="text-muted">
              started
              {moment(start).format('hh:mm:ss')}
            </span>
          )}
          {duration && <span className="text-muted">{formatDuration(duration[0], duration[1])}</span>}
        </div>
      </div>
      {job && <JobLogs jobId={job._id} />}
    </div>
  );
}
