import React, { useEffect, useRef, useState } from 'react';
import { filter } from 'rxjs/operators';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEnv } from '../../providers/EnvProvider';
import { Loader } from '../../commons/components/Loader';
import { appEvents } from '../../providers/app-events';
import { RepoCard } from './RepoCard';
import { getRepos } from './get-repos';
import { LoadMore } from '../pipelines/list/LoadMore';
import { defaultPagination, PaginationData } from '../../commons/components/Pagination';
import { Page } from '../../commons/models/page';
import { EmptyList } from '../../commons/components/EmptyList';
import RepoIcon from '../icons/RepoIcon';
import { useAuth } from '../../providers/AuthProvider';

export function RepoList() {
  const env = useEnv();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const pagesRef = useRef([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLastPage, setIsLastPage] = useState(true);
  const [paginationData, setPaginationData] = useState<PaginationData>(defaultPagination());

  const fetchRepos = (reset = false) => {
    getRepos(env, '', paginationData)
      .then(data => {
        pagesRef.current = [...(reset ? [] : pagesRef.current), data];
        setPages(pagesRef.current);
        setIsLastPage(Math.floor(data.count / paginationData.size) === paginationData.page);
      })
      .catch(err => {
        console.log(err);
        toast('Could not list repos', { type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env, paginationData]);

  useEffect(() => {
    const subscription = appEvents.pipe(filter(({ id }) => id === 'repos')).subscribe(() => fetchRepos(true));
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env]);

  const loadMore = () => {
    setPaginationData({
      ...paginationData,
      page: paginationData.page + 1,
    });
  };

  return (
    <>
      {pages.length === 0 && loading && <Loader />}
      {pages.length === 0 ? (
        <>No repos</>
      ) : (
        pages.map(({ items }, index) => (
          <div className="mt-4" key={index}>
            {items.length === 0 ? (
              <EmptyList icon={<RepoIcon />} title="No repos" subTitle={user ? 'Did you sync ?' : 'Sign in to view your repos'} />
            ) : (
              items.map(({ repo, latestPipeline }) => (
                <Link to={`/repos/${repo._id}`} className="mt-3 d-block" key={repo._id}>
                  <RepoCard repo={repo} latestPipeline={latestPipeline} />
                </Link>
              ))
            )}
            {index === pages.length - 1 && !isLastPage && (
              <div className="d-flex align-items-center flex-column mt-5">
                {loading && <Loader className="mb-4 animated fadeInUp faster" />}
                <div>
                  <LoadMore onClick={loadMore} />
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
