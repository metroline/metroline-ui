import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEnv } from '../../../providers/EnvProvider';
import { axios } from '../../../providers/axios';
import { Loader } from '../../../commons/components/Loader';
import { AlertError } from '../../../commons/components/AlertError';
import styles from './PipelineList.module.scss';
import { defaultPagination, PaginationData } from '../../../commons/components/Pagination';
import { PipelineListItem } from './PipelineListItem';
import { Page } from '../../../commons/models/page';
import { LoadMore } from './LoadMore';
import { useRepoPipeline } from '../../repos/live-repo';
import { EmptyList } from '../../../commons/components/EmptyList';
import { PipelineIcon } from '../../icons/PipelineIcon';

function PipelinePage({ pipelines, repoId }) {
  return pipelines.map(pipeline => (
    <Link to={`/repos/${repoId}/pipelines/${pipeline._id}`} className="block-link pipeline-list-item-link" key={pipeline._id}>
      <PipelineListItem pipeline={pipeline} />
    </Link>
  ));
}

export function PipelineList() {
  const { repoId } = useParams();
  const env = useEnv();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [paginationData, setPaginationData] = useState<PaginationData>(defaultPagination());
  const pagesRef = useRef([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLastPage, setIsLastPage] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<Page>(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/pipelines`, {
        params: {
          page: paginationData.page,
          size: paginationData.size,
        },
      })
      .then(({ data }) => {
        pagesRef.current = [...pagesRef.current, data];
        setPages(pagesRef.current);
        setIsLastPage(Math.floor(data.count / paginationData.size) === paginationData.page);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading, env, repoId, paginationData]);

  const [repoPipeline] = useRepoPipeline(repoId);

  useEffect(() => {
    if (repoPipeline) {
      pagesRef.current[0].items = [repoPipeline, ...pagesRef.current[0].items];
      setPages([...pagesRef.current]);
    }
  }, [repoPipeline]);

  const loadMore = () => {
    setPaginationData({
      ...paginationData,
      page: paginationData.page + 1,
    });
  };

  return (
    <div className="mt-4">
      {pages.length === 0 && loading && <Loader />}
      {error && <AlertError error={error} />}
      {pages && (
        <div className={styles.pages}>
          {/* <div className="pipeline-timeline" /> */}
          {pages.map(({ items }, index) => (
            <div key={index} className={styles.page}>
              {items.length === 0 ? (
                <EmptyList icon={<PipelineIcon />} title="No pipelines" subTitle="Push to your repo to start building" />
              ) : (
                <PipelinePage repoId={repoId} pipelines={items} />
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
          ))}
        </div>
      )}
    </div>
  );
}
