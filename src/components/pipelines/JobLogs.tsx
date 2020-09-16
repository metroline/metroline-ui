import React, { useEffect, useRef, useState } from 'react';
import { chalkHtml } from '../../commons/chalk-replace/chalk-html';
import { AlertError } from '../../commons/components/AlertError';
import { Loader } from '../../commons/components/Loader';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import styles from './JobLogs.module.scss';
import { useJobLog } from './live-job';

function sortLogs(a, b) {
  const jobIndexDiff = a.jobIndex - b.jobIndex;
  if (jobIndexDiff === 0) {
    return a.index - b.index;
  }
  return jobIndexDiff;
}

function formatLog(log) {
  return {
    ...log,
    text: chalkHtml(log.text),
  };
}

export function JobLogs({ jobId }: { jobId: string }) {
  const env = useEnv();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>();
  const [error, setError] = useState();
  const logsRef = useRef([]);

  const addLogs = newLogs => {
    logsRef.current.push(...newLogs.map(log => formatLog(log)));
    logsRef.current.sort(sortLogs);
    setLogs([...logsRef.current]);
  };

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get(`${env.METROLINE_SERVER_URL}/api/v1/jobs/${jobId}/logs`)
      .then(res => addLogs(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, jobId]);

  const [jobLog] = useJobLog(jobId);
  useEffect(() => {
    if (jobLog) {
      addLogs([jobLog]);
    }
  }, [jobLog]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      <div className={styles.wrapper}>
        <pre className={styles.logs}>
          {logs ? (
            logs.map(log => <code key={log._id} className="run-log-code" dangerouslySetInnerHTML={{ __html: log.text }} />)
          ) : (
            <Loader />
          )}
        </pre>
      </div>
    </>
  );
}
