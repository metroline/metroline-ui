import { axios } from '../../providers/axios';
import { PaginationData } from '../../commons/components/Pagination';
import { Page } from '../../commons/models/page';
import { Repo } from '../pipelines/types/repo';
import { Pipeline } from '../pipelines/types/pipeline';

export function getRepos(
  env,
  search?,
  pagination?: PaginationData,
): Promise<
  Page<{
    repo: Repo;
    latestPipeline: Pipeline;
  }>
> {
  return axios
    .get(`${env.METROLINE_SERVER_URL}/api/v1/repos`, {
      params: {
        search: search || undefined,
        page: pagination?.page,
        size: pagination?.size,
      },
    })
    .then(res => res.data);
}
