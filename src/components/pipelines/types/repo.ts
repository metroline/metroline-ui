import { PipelineStatus } from './pipeline';

export interface Repo {
  _id: string;
  repoId: string;
  name: string;
  url: string;
  lastUpdate?: Date;
  isSetup: boolean;
  status?: PipelineStatus;

  permissions?: {
    pull: boolean;
    push: boolean;
    admin: boolean;
  };
}
