import { PipelineStatus } from './pipeline';

export interface Repo {
  _id: string;
  repoId: string;
  name: string;
  url: string;
  lastUpdate?: Date;
  isSetup: boolean;
  publicKey?: string;
  status?: PipelineStatus;
  permissions?: {
    pull: boolean;
    push: boolean;
    admin: boolean;
  };
}
