import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { appEvents } from '../../providers/app-events';
import { Tooltip, tooltipToggle } from '../../commons/components/Tooltip';

export function SyncRepos() {
  const env = useEnv();
  const [loading, setLoading] = useState(false);

  const sync = () => {
    setLoading(true);
    axios
      .post(`${env.METROLINE_SERVER_URL}/api/v1/repos/sync`)
      .then(() => appEvents.next({ id: 'repos' }))
      .then(() => toast('Repos synced', { type: 'success' }))
      .catch(err => toast(`Could not sync repos: ${err}`, { type: 'error' }))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <FontAwesomeIcon icon={faSync} spin={loading} className="btn-icon" {...tooltipToggle('sync-repos-tooltip')} onClick={sync} />
      <Tooltip id="sync-repos-tooltip">Sync repos</Tooltip>
    </>
  );
}
