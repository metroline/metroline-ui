import { D3SvgSelection } from '../types/d3-svg-selection';
import { Station } from '../types/station';
import { GraphMargin } from './graph-margin';
import { applyMargin } from './apply-margin';
import { PipelineJob } from '../../pipelines/types/pipeline';

export function drawStationNames(svg: D3SvgSelection, nodes: Station[], margin: GraphMargin, nodeHeight: number) {
  svg
    .selectAll('job.label')
    .data(nodes)
    .enter()
    .append('text')
    .attr(...applyMargin(margin))
    .attr('class', 'pipeline-job-label')
    .attr('x', (d: Station) => d.x)
    .attr('y', (d: Station) => d.y - (nodeHeight / 2 + 20))
    .attr('text-anchor', 'middle')
    // .attr('dominant-baseline', 'central')
    .attr('dominant-baseline', 'middle')
    .text((datum: Station<PipelineJob>) => datum.meta.name);
}
