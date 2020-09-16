import React, { createContext, useContext, useEffect, useState } from 'react';
import { merge } from 'lodash';
import { FullPageLoader } from '../commons/components/FullPageLoader';
import { FullPageCentered } from '../commons/components/FullPageCentered';
import { AlertError } from '../commons/components/AlertError';
import { axios } from './axios';

export interface Environment {
  METROLINE_SERVER_URL: string;
}

const defaultEnv: Partial<Environment> = {};

export const EnvContext = createContext<Environment>(undefined);

export const useEnv = () => useContext(EnvContext);

export function EnvProvider(props) {
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState<Environment>();
  const [error, setError] = useState();

  useEffect(() => {
    axios
      .get('/env.json')
      .then(({ data }) => merge(defaultEnv, data))
      .then(loadedEnv => {
        setEnv(loadedEnv);
        console.log('env', loadedEnv);
      })
      .finally(() => setLoading(false))
      .catch(setError);
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  if (error) {
    return (
      <FullPageCentered>
        <AlertError error={error} />
      </FullPageCentered>
    );
  }

  return <EnvContext.Provider value={env} {...props} />;
}
