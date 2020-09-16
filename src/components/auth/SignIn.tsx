import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import giteaLogo from '../../assets/images/gitea-logo.svg';
import githubLogo from '../../assets/images/github-logo.svg';
import gitlabLogo from '../../assets/images/gitlab-logo.svg';
import { Button } from '../../commons/components/Button';
import { Loader } from '../../commons/components/Loader';
import { useAuth } from '../../providers/AuthProvider';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import styles from './SignIn.module.scss';

function SignInWithGitea() {
  const { signInWithGitea } = useAuth();
  return (
    <Button className={`${styles.button} ${styles.gitea}`} onClick={signInWithGitea}>
      <img className={styles.icon} src={giteaLogo} alt="gitea-logo" />
      Sign in
    </Button>
  );
}

function SignInWithGitlab() {
  const { signInWithGitlab } = useAuth();
  return (
    <Button className={`${styles.button} ${styles.gitlab}`} onClick={signInWithGitlab}>
      <img className={styles.icon} src={gitlabLogo} alt="gitlab-logo" />
      Sign in
    </Button>
  );
}

function SignInWithGithub() {
  const { signInWithGithub } = useAuth();
  return (
    <Button className={`${styles.button} ${styles.github}`} onClick={signInWithGithub}>
      <img className={styles.icon} src={githubLogo} alt="github-logo" />
      Sign in
    </Button>
  );
}

export function SignIn() {
  const env = useEnv();
  const [loading, setLoading] = useState<boolean>();
  const [signInMethod, setSignInMethod] = useState<string>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${env.METROLINE_SERVER_URL}/auth/methods`)
      .then(({ data }) => setSignInMethod(data[0]))
      .catch(error => toast(`Could not load sign-in methods: ${error}`, { type: 'error' }))
      .finally(() => setLoading(false));
  }, [env]);

  return (
    <div className="sign-in text-light">
      {loading && <Loader />}
      {signInMethod
        && (() => {
          switch (signInMethod) {
            case 'gitlab':
              return <SignInWithGitlab />;
            case 'gitea':
              return <SignInWithGitea />;
            case 'github':
              return <SignInWithGithub />;
            default:
              return `Unrecognized signInMethod (${signInMethod})`;
          }
        })()}
    </div>
  );
}
