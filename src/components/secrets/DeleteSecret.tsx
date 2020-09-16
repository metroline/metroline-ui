import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { Button } from '../../commons/components/Button';

export function DeleteSecret({ repoId, secretId, onDeleted }: { repoId: string; secretId: string; onDeleted: () => void }) {
  const env = useEnv();
  const [loading, setLoading] = useState(false);

  const deleteSecret = e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    axios
      .delete(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/secrets/${secretId}`)
      .then(() => onDeleted())
      .catch(err => {
        console.error(err);
        toast('Could not delete secret', { type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Button className="btn btn-danger btn-sm" loading={loading} onClick={deleteSecret}>
      Delete
    </Button>
  );
}
