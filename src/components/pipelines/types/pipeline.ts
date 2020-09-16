export type PipelineJobStatus = 'created' | 'running' | 'success' | 'failure' | 'skipped' | 'cancelled';

/*
 * process.hrtime format: [seconds, microseconds]
 */
export type Duration = [number, number];

export interface PipelineJob {
  _id: string;
  allowFailure: boolean;
  name: string;
  bin: string;
  index: number;
  image: string;
  script: string[];
  status: PipelineJobStatus;
  start?: Date;
  end?: Date;
  duration?: Duration;
  dependencies?: string[];
}

export type PipelineStatus = 'created' | 'running' | 'success' | 'failure' | 'partial' | 'skipped' | 'cancelled' | 'unknown';

export interface Commit {
  sha: string;
  repoId: string;
  gitSshUrl: string;
  url: string;
  message: string;
  author: string;
  branch: string;
}

export interface Pipeline {
  _id?: string;
  repoId: string;
  createdAt: Date;
  cancelledAt?: Date;
  status: PipelineStatus;
  start?: Date;
  end?: Date;
  duration?: Duration;
  commit: Commit;
  error?: string;
}
