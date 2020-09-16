import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { Button } from '../../commons/components/Button';

export function SetupRepo({ repoId, permissions, onSetup }: { repoId; permissions; onSetup? }) {
  const env = useEnv();
  const [loading, setLoading] = useState(false);

  const setup = e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    axios
      .post(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/setup`)
      .then(() => routerHistory.push(`/repos/${repoId}`))
      .then(() => {
        if (onSetup) {
          onSetup();
        }
      })
      .catch(err => toast(`Could not setup repo: ${err}`, { type: 'error' }))
      .finally(() => setLoading(false));
  };

  return permissions?.admin ? (
    <Button onClick={setup} loading={loading} className="btn btn-primary">
      Setup
    </Button>
  ) : (
    <></>
  );
}
