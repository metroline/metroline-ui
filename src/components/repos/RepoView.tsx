import React, { useEffect, useState } from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { faCog, faExternalLinkAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { axios } from '../../providers/axios';
import { useEnv } from '../../providers/EnvProvider';
import { Loader } from '../../commons/components/Loader';
import { SetupRepo } from './SetupRepo';
import { AlertError } from '../../commons/components/AlertError';
import { NotFound } from '../../commons/components/NotFound';
import { PipelineList } from '../pipelines/list/PipelineList';
import { DisableRepo } from './DisableRepo';
import { Dropdown, dropdownToggle } from '../../commons/components/dropdown/Dropdown';
import { SubHeader } from '../SubHeader';
import { SecretList } from '../secrets/SecretList';
import DropdownSeparator from '../../commons/components/dropdown/DropdownSeparator';
import { DropdownLink } from '../../commons/components/dropdown/DropdownLink';
import { RunManualPipeline } from '../pipelines/run-manual/RunManualPipeline';
import { useRepoLastUpdate } from './live-repo';
import { PipelineView } from '../pipelines/PipelineView';
import { Repo } from '../pipelines/types/repo';
import { PipelineIcon } from '../icons/PipelineIcon';
import { SecretIcon } from '../icons/SecretIcon';
import { PublicKey } from './PublicKey';

export function RepoView() {
  const { repoId } = useParams();
  const env = useEnv();
  const { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState<Repo>();
  const [error, setError] = useState();
  const [isSetup, setIsSetup] = useState(false);
  const [lastUpdate, setLastUpdate] = useRepoLastUpdate(repoId);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}`, {})
      .then(res => setRepo(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, repoId]);

  useEffect(() => {
    if (repo) {
      setIsSetup(repo.isSetup);
      setLastUpdate(repo.lastUpdate);
    }
  }, [repo, setLastUpdate]);

  const dropdownId = `repo-${repoId}-dropdown`;
  const onSetup = () => setIsSetup(true);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <>
      <SubHeader className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">{repo.name}</h5>
          <div className="ml-3">
            <a href={repo.url} target="_blank" rel="noreferrer noopener">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
        </div>
        {isSetup && (
          <div className="d-flex align-items-center">
            <div className="text-muted">{moment(lastUpdate).fromNow()}</div>
            {repo.permissions?.push && (
              <div className="ml-3">
                <RunManualPipeline repoId={repoId} />
              </div>
            )}
            <div className="ml-3 cursor-pointer" {...dropdownToggle(dropdownId)}>
              <FontAwesomeIcon icon={faCog} size="2x" />
            </div>
            <Dropdown id={dropdownId}>
              <DropdownLink to={`${url}/pipelines`} icon={<PipelineIcon />}>
                Pipelines
              </DropdownLink>
              {repo.permissions?.admin && (
                <>
                  <DropdownLink to={`${url}/secrets`} icon={<SecretIcon />}>
                    Secrets
                  </DropdownLink>
                  {repo.publicKey && (
                    <PublicKey publicKey={repo.publicKey}>
                      <DropdownLink to={`${url}/secrets`} icon={<FontAwesomeIcon icon={faKey} />}>
                        Public key
                      </DropdownLink>
                    </PublicKey>
                  )}
                  <DropdownSeparator />
                  <DisableRepo repoId={repoId} />
                </>
              )}
            </Dropdown>
          </div>
        )}
      </SubHeader>
      <div className="mb-5">
        {isSetup ? (
          <>
            <Switch>
              <Route path={[path, `${path}/pipelines`]} exact component={PipelineList} />
              <Route path={`${path}/pipelines/:pipelineId`} exact component={PipelineView} />
              {repo.permissions?.admin && <Route path={`${path}/secrets`} exact component={SecretList} />}
              <Route component={NotFound} />
            </Switch>
          </>
        ) : (
          <>
            <SetupRepo repoId={repoId} permissions={repo.permissions} onSetup={onSetup} />
          </>
        )}
      </div>
    </>
  );
}
