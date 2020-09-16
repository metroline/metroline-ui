import { Selection } from 'd3';
import { GraphMargin } from './graph-margin';
import { getStatusIcon } from '../../status/get-status-icon';
import { Station } from '../types/station';
import { PipelineJob } from '../../pipelines/types/pipeline';

export function setStationIcon(selection: Selection<any, any, any, any>, nodeHeight: number, margin: GraphMargin, status?: any) {
  const iconToStationRatio = 0.6;
  const iconFinalHeight = iconToStationRatio * nodeHeight;
  selection
    // TODO is there a way to set multiple attrs in one go ?
    .attr('class', 'pipeline-job-icon')
    .attr('d', d => {
      const { icon } = getStatusIcon(status || (d as Station<PipelineJob>).meta.status);
      const iconPath = icon.icon[4];
      return iconPath as string;
    })
    .attr('transform', d => {
      const { icon } = getStatusIcon(status || (d as Station<PipelineJob>).meta.status);
      const iconWidth = icon.icon[0];
      const iconHeight = icon.icon[1];

      const scale = 1 / (iconHeight / iconFinalHeight);

      const offsetLeft = (nodeHeight - iconWidth * scale) / 2;
      const translateLeft = d.x + margin.left - nodeHeight / 2 + offsetLeft;

      const offsetTop = (nodeHeight - iconHeight * scale) / 2;
      const translateTop = d.y + margin.top - nodeHeight / 2 + offsetTop;

      return `translate(${translateLeft},${translateTop}), scale(${scale})`;
    });
}
