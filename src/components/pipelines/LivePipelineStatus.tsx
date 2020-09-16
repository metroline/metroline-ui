import React from 'react';
import { StatusIndicator } from '../status/StatusIndicator';
import { usePipelineStatus } from './live-pipeline';
import { PipelineStatus } from './types/pipeline';

export function LivePipelineStatus({ pipelineId, pipelineStatus }: { pipelineId: string; pipelineStatus: PipelineStatus }) {
  const [status] = usePipelineStatus(pipelineId, pipelineStatus);
  return <StatusIndicator status={status} />;
}
