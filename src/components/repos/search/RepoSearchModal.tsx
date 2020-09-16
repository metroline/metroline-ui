import React, { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './RepoSearchModal.module.scss';
import { useEnv } from '../../../providers/EnvProvider';
import { routerHistory } from '../../../providers/history';
import { RepoCard } from '../RepoCard';
import { getRepos } from '../get-repos';
import { Loader } from '../../../commons/components/Loader';

function blurBackground() {
  document.getElementById('root').setAttribute('data-blur', 'true');
}

function unblurBackground() {
  document.getElementById('root').removeAttribute('data-blur');
}

export function RepoSearchModal({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  const env = useEnv();
  const [search$] = useState(new BehaviorSubject(''));
  const [loading, setLoading] = useState<boolean>();
  const [repos, setRepos] = useState<any[]>();
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement>();

  useEffect(() => {
    if (isOpen) {
      const subs = search$
        .pipe(
          filter(value => !value || value.length >= 3),
          debounceTime(200),
          distinctUntilChanged(),
        )
        .subscribe(value => {
          setLoading(true);
          getRepos(env, value)
            .then(data => setRepos(data.items))
            .catch(console.error)
            .finally(() => setLoading(false));
        });
      return () => {
        subs.unsubscribe();
      };
    }
  }, [search$, env, isOpen]);

  useEffect(() => {
    if (isOpen) {
      blurBackground();
      if (searchInputRef) {
        searchInputRef.focus();
      }
      return () => {
        unblurBackground();
      };
    }
  }, [isOpen, searchInputRef]);

  const close = () => {
    unblurBackground();
    closeModal();
  };

  const onRepoClick = repo => {
    routerHistory.push(`/repos/${repo._id}`);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={close} overlayClassName={styles.overlay} className={`${styles.container} pt-5 pb-5`}>
      <div className="search-modal-content">
        <FontAwesomeIcon icon={faTimes} onClick={close} size="2x" className={`btn-icon ${close}`} />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-center position-relative">
                <input
                  type="text"
                  ref={setSearchInputRef}
                  className="form-control"
                  onChange={e => search$.next(e.target.value)}
                  placeholder="Search repos"
                />
                {loading && (
                  <div className={styles.loader}>
                    <Loader />
                  </div>
                )}
              </div>
              {repos && (
                <div className="mt-3">
                  {repos.length === 0 && <strong className="text-light">No results</strong>}
                  <TransitionGroup>
                    {repos.length !== 0
                      && repos.map(({ repo, latestPipeline }) => (
                        <CSSTransition key={repo._id} timeout={500} classNames="fade-down">
                          <div className="mb-3" onClick={() => onRepoClick(repo)}>
                            <RepoCard repo={repo} latestPipeline={latestPipeline} />
                          </div>
                        </CSSTransition>
                      ))}
                  </TransitionGroup>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
