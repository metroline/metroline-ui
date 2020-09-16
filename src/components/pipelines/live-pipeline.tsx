import { useEffect, useState } from 'react';
import { emitNowAndOnReconnect, listen } from '../../providers/websockets/listen';
import { useSocket } from '../../providers/websockets/SocketProvider';

export function usePipelineEnd(pipelineId, initialValue?) {
  const socket = useSocket();

  const [end, setEnd] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.pipeline', pipelineId)), [socket, pipelineId]);

  useEffect(() => listen(socket, `pipeline.${pipelineId}.end`, ({ date }) => setEnd(date)), [socket, pipelineId]);

  return [end, setEnd];
}

export function usePipelineDuration(pipelineId, initialValue?) {
  const socket = useSocket();

  const [duration, setDuration] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.pipeline', pipelineId)), [socket, pipelineId]);

  useEffect(() => listen(socket, `pipeline.${pipelineId}.end`, ({ duration: d }) => setDuration(d)), [socket, pipelineId]);

  return [duration, setDuration];
}

export function usePipelineError(pipelineId, initialValue?) {
  const socket = useSocket();

  const [error, setError] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.pipeline', pipelineId)), [socket, pipelineId]);

  useEffect(() => listen(socket, `pipeline.${pipelineId}.error`, setError), [socket, pipelineId]);

  return [error, setError];
}

export function usePipelineJobs(pipelineId, initialValue?) {
  const socket = useSocket();

  const [jobs, setJobs] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.pipeline', pipelineId)), [socket, pipelineId]);

  useEffect(() => listen(socket, `pipeline.${pipelineId}.jobs`, setJobs), [socket, pipelineId]);

  return [jobs, setJobs];
}

export function usePipelineStatus(pipelineId, initialValue?) {
  const socket = useSocket();

  const [status, setStatus] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.pipeline', pipelineId)), [socket, pipelineId]);

  useEffect(() => listen(socket, `pipeline.${pipelineId}.status`, setStatus), [socket, pipelineId]);

  return [status, setStatus];
}
