import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEnv } from './EnvProvider';
import { axios } from './axios';

export interface User {
  name: string;
}

export interface AuthProviderContextData {
  user: User;
  signOut: () => void;
  signInWithGitlab: () => void;
  signInWithGitea: () => void;
  signInWithGithub: () => void;
}

export const AuthContext = createContext<AuthProviderContextData>(undefined);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider(props) {
  const [user, setUser] = useState<User>();
  const env = useEnv();

  const signInWithGitlab = () => {
    window.location.href = `${env.METROLINE_SERVER_URL}/auth/gitlab/oauth/redirect`;
  };
  const signInWithGitea = () => {
    window.location.href = `${env.METROLINE_SERVER_URL}/auth/gitea/oauth/redirect`;
  };
  const signInWithGithub = () => {
    window.location.href = `${env.METROLINE_SERVER_URL}/auth/github/oauth/redirect`;
  };

  const signOut = () => {
    axios
      .post(`${env.METROLINE_SERVER_URL}/auth/signout`)
      .then(() => setUser(null))
      // force app to reset
      .then(() => {
        window.location.href = '/';
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (env) {
      axios
        .get(`${env.METROLINE_SERVER_URL}/api/v1/user`)
        .then(({ data }) => setUser(data))
        .catch(err => {
          console.error(err);
          setUser(null);
        });
    }
  }, [env]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGitlab,
        signInWithGitea,
        signInWithGithub,
        signOut,
      }}
      {...props}
    />
  );
}
