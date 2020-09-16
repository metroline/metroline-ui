import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { useEnv } from '../../../providers/EnvProvider';
import styles from './RunManualPipelineModal.module.scss';
import { axios } from '../../../providers/axios';
import { textSearch } from '../../../utils/text-search';
import { AlertError } from '../../../commons/components/AlertError';
import { Dropdown } from '../../../commons/components/dropdown/Dropdown';
import { Loader } from '../../../commons/components/Loader';

interface GitBranch {
  name: string;
}

function BranchListItem({ branch }: { branch: GitBranch }) {
  return (
    <div className={styles.branch}>
      <FontAwesomeIcon icon={faCodeBranch} className="mr-3" />
      {branch.name}
    </div>
  );
}

export function RunManualPipelineModal({
  repoId,
  id,
  onBranchClick,
}: {
  repoId: string;
  id: string;
  onBranchClick: (name: string) => void;
}) {
  const env = useEnv();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState();
  const branchesRef = useRef([]);
  const [branches, setBranches] = useState<any[]>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/branches`)
      .then(({ data }) => {
        branchesRef.current = data;
        setBranches(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, repoId]);

  const search = terms => {
    setBranches(branchesRef.current.filter(branch => textSearch(terms, branch.name)));
  };

  return (
    <Dropdown id={id}>
      <div
        className="p-3"
        onClick={e => {
          // prevent clicks in dropdown to close dropdown
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="d-flex justify-content-center position-relative">
          <input type="text" className="form-control" onChange={e => search(e.target.value)} placeholder="Search repos" />
          {loading && (
            <div className={styles.loader}>
              <Loader />
            </div>
          )}
        </div>
        {error && <AlertError error={error} className="mt-4" />}
        {branches && (
          <div className="mt-4">
            {branches.length === 0 && <strong className="text-light">No results</strong>}
            <TransitionGroup>
              {branches.length !== 0
                && branches.map(branch => (
                  <CSSTransition key={branch.name} timeout={500} classNames="fade-down">
                    <div onClick={() => onBranchClick(branch)} className={styles['branch-container']}>
                      <BranchListItem branch={branch} />
                    </div>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          </div>
        )}
      </div>
    </Dropdown>
  );
}
