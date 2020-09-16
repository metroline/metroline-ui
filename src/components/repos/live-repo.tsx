import { useEffect, useState } from 'react';
import { useSocket } from '../../providers/websockets/SocketProvider';
import { emitNowAndOnReconnect, listen } from '../../providers/websockets/listen';

export function useRepoPipeline(repoId, initialValue?) {
  const socket = useSocket();

  const [pipeline, setPipeline] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.repo', repoId)), [socket, repoId]);

  useEffect(() => listen(socket, `repo.${repoId}.pipeline`, setPipeline), [socket, repoId]);

  return [pipeline, setPipeline];
}

export function useRepoLastUpdate(repoId, initialValue?) {
  const socket = useSocket();

  const [lastUpdate, setLastUpdate] = useState(initialValue);

  useEffect(() => emitNowAndOnReconnect(socket, () => socket.emit('join.repo', repoId)), [socket, repoId]);

  useEffect(() => listen(socket, `repo.${repoId}.lastUpdate`, setLastUpdate), [socket, repoId]);

  return [lastUpdate, setLastUpdate];
}
