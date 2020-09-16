import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { AddSecret } from './AddSecret';
import { SecretView } from './SecretView';
import { GlobalSecret, Secret } from './secret';

const sortSecrets = (a, b) => a.name.localeCompare(b.attr);

export function SecretList() {
  const { repoId } = useParams();
  const env = useEnv();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [secrets, setSecrets] = useState<Secret[]>();
  const [globalSecrets, setGlobalSecrets] = useState<GlobalSecret[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    Promise.all([
      axios.get(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/secrets`, {}).then(res => setSecrets(res.data)),
      axios.get(`${env.METROLINE_SERVER_URL}/api/v1/secrets`, {}).then(res => setGlobalSecrets(res.data)),
    ])
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, repoId]);

  const onAdded = secret => {
    setSecrets([...secrets, secret].sort(sortSecrets));
  };

  const onUpdated = secret => {
    setSecrets(secrets.map(s => (s._id === secret._id ? secret : s)));
  };

  const onDeleted = secret => {
    setSecrets(secrets.filter(s => s._id !== secret._id).sort(sortSecrets));
  };

  return (
    <>
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Secrets</strong>
        </div>
        <div className="card-body">
          {loading ? (
            <Loader />
          ) : error ? (
            <AlertError error={error} />
          ) : (
            <div>
              {globalSecrets.length === 0 ? (
                <></>
              ) : (
                <div className="list-group global-secrets">
                  {globalSecrets.map(secret => (
                    <SecretView key={secret.name} secret={secret} />
                  ))}
                </div>
              )}
              {secrets.length === 0 ? (
                <></>
              ) : (
                <ul className="list-group mb-4 repo-secrets">
                  {secrets.map(secret => (
                    <SecretView secret={secret} key={secret.name} onUpdated={onUpdated} onDeleted={() => onDeleted(secret)} />
                  ))}
                </ul>
              )}
            </div>
          )}
          <AddSecret repoId={repoId} onAdded={onAdded} />
        </div>
      </div>
    </>
  );
}
