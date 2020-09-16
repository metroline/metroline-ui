import { useEffect, useState } from 'react';
import { emitNowAndOnReconnect, listen } from '../../providers/websockets/listen';
import { useSocket } from '../../providers/websockets/SocketProvider';

export function useJobLog(jobId, initialValue?) {
  const socket = useSocket();

  const [log, setLog] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.job', jobId)), [socket, jobId]);

  useEffect(() => listen(socket, `job.${jobId}.log`, setLog), [socket, jobId]);

  return [log, setLog];
}

export function useJobStatus(jobId, initialValue?) {
  const socket = useSocket();

  const [status, setStatus] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.job', jobId)), [socket, jobId]);

  useEffect(() => listen(socket, `job.${jobId}.status`, setStatus), [socket, jobId]);

  return [status, setStatus];
}

export function useJobStart(jobId, initialValue?) {
  const socket = useSocket();

  const [start, setStart] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.job', jobId)), [socket, jobId]);

  useEffect(() => listen(socket, `job.${jobId}.start`, setStart), [socket, jobId]);

  return [start, setStart];
}

export function useJobEnd(jobId, initialValue?) {
  const socket = useSocket();

  const [end, setEnd] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.job', jobId)), [socket, jobId]);

  useEffect(() => listen(socket, `job.${jobId}.end`, ({ date }) => setEnd(date)), [socket, jobId]);

  return [end, setEnd];
}

export function useJobDuration(jobId, initialValue?) {
  const socket = useSocket();

  const [duration, setDuration] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.job', jobId)), [socket, jobId]);

  useEffect(() => listen(socket, `job.${jobId}.end`, ({ duration: d }) => setDuration(d)), [socket, jobId]);

  return [duration, setDuration];
}
