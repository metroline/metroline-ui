import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlink } from '@fortawesome/free-solid-svg-icons';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { routerHistory } from '../../providers/history';
import { DropdownLink } from '../../commons/components/dropdown/DropdownLink';
import { Loader } from '../../commons/components/Loader';

export function DisableRepo({ repoId }: { repoId: string }) {
  const env = useEnv();
  const [loading, setLoading] = useState(false);

  const setup = e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    axios
      .post(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/disable`)
      .then(() => routerHistory.push('/repos'))
      .then(() => toast('Repo disabled', { type: 'success' }))
      .catch(err => {
        console.error(err);
        toast('Could not disable repo', { type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <DropdownLink onClick={setup} icon={<FontAwesomeIcon icon={faUnlink} />}>
      Disable
      {loading && <Loader className="ml-3" />}
    </DropdownLink>
  );
}
