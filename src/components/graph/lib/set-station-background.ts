import { Station } from '../types/station';
import { PipelineJob } from '../../pipelines/types/pipeline';
import { getGradient } from './add-svg-defs';

export function setStationBackground(status?): [string, any] {
  return [
    'fill',
    (d: Station<PipelineJob>) => {
      const gradient = getGradient(status || d.meta.status, d.meta.allowFailure);
      return `url(#${gradient})`;
    },
  ];
}
