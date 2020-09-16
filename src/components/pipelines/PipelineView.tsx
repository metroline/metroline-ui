import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertError } from '../../commons/components/AlertError';
import { EmptyList } from '../../commons/components/EmptyList';
import { Loader } from '../../commons/components/Loader';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { Graph } from '../graph/Graph';
import JobIcon from '../icons/JobIcon';
import { CancelPipeline } from './CancelPipeline';
import { Job } from './Job';
import { usePipelineEnd, usePipelineError, usePipelineJobs } from './live-pipeline';
import { PipelineCard } from './PipelineCard';
import styles from './PipelineView.module.scss';
import { Pipeline } from './types/pipeline';

const sortJobsFn = (a, b) => a.index - b.index;

export function PipelineView() {
  const { pipelineId } = useParams();
  const env = useEnv();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [pipeline, setPipeline] = useState<Pipeline>();

  const jobsRef = useRef([]);
  const [cancelledAt, setCancelledAt] = useState<Date>();

  const [jobs, setJobs] = useState(pipelineId);
  const [pipelineError, setPipelineError] = usePipelineError(pipelineId);
  const [end, setEnd] = usePipelineEnd(pipelineId);
  const [liveJobs] = usePipelineJobs(pipelineId);

  const addJobs = (newJobs: any[], reset = false) => {
    if (reset) {
      jobsRef.current = newJobs;
    } else {
      jobsRef.current.push(...newJobs);
    }
    jobsRef.current.sort(sortJobsFn);
    setJobs([...jobsRef.current]);
  };

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    Promise.all([
      axios
        .get(`${env.METROLINE_SERVER_URL}/api/v1/pipelines/${pipelineId}`, {})
        .then(res => res.data)
        .then(setPipeline),
      axios
        .get(`${env.METROLINE_SERVER_URL}/api/v1/pipelines/${pipelineId}/jobs`, {})
        .then(res => res.data.sort(sortJobsFn))
        .then(newJobs => {
          addJobs(newJobs, true);
        }),
    ])
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, pipelineId]);

  useEffect(() => {
    if (pipeline) {
      setCancelledAt(pipeline.cancelledAt);
      setEnd(pipeline.end);
      setPipelineError(pipeline.error);
    }
  }, [pipeline, setEnd, setPipelineError]);

  useEffect(() => {
    if (liveJobs) {
      addJobs(liveJobs);
    }
  }, [liveJobs]);

  const onJobClick = jobId => {
    window.scroll({
      behavior: 'smooth',
      top: document.getElementById(`job-${jobId}`).offsetTop,
    });
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      <div className="d-flex align-items-center justify-content-between mt-4">
        <Link to="./">
          <FontAwesomeIcon icon={faLongArrowAltLeft} className="mr-2" />
          Pipelines
        </Link>
        <div>{!cancelledAt && !end && <CancelPipeline pipelineId={pipelineId} onCancelled={setCancelledAt} />}</div>
      </div>
      <div className="mt-4">
        <PipelineCard pipeline={pipeline} raised />
      </div>
      {pipelineError && <AlertError error={pipelineError} className="mt-4" />}
      {!jobs || jobs.length === 0 ? (
        <div className="mt-4">
          <EmptyList icon={<JobIcon />} title="No jobs" subTitle="We haven't found any jobs for this pipeline" />
        </div>
      ) : (
        <div className="d-flex align-items-stretch mt-4">
          <div className="mr-4 mb-4 flex-shrink-0">
            <Graph pipelineId={pipeline._id} jobs={jobs} onJobClick={onJobClick} />
          </div>
          <div className={styles.jobs}>
            {jobs
              .filter(job => job.status !== 'skipped')
              .map(job => (
                <div className="job-anchor mb-4" key={job._id} id={`job-${job._id}`}>
                  <Job job={job} key={job._id} />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
