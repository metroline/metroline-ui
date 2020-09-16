import { Selection } from 'd3';
import { Station } from '../types/station';
import { PipelineJob } from '../../pipelines/types/pipeline';
import { applyMargin } from './apply-margin';
import { GraphMargin } from './graph-margin';
import { D3SvgSelection } from '../types/d3-svg-selection';
import { drawStationNames } from './draw-station-names';
import { setStationIcon } from './set-station-icon';
import { setStationBackground } from './set-station-background';

function onClick(onStationClick: (id: string) => void): [string, any] {
  return [
    'click',
    (e: any, datum: Station<PipelineJob>) => {
      onStationClick(datum.meta._id);
    },
  ];
}

function getStationId(station: Station): string {
  return `station-${station.meta._id}`;
}

function drawIcons(svg: D3SvgSelection, nodes: Station[], margin: GraphMargin, nodeHeight: number, onStationClick: (id: string) => void) {
  const icons: Selection<SVGPathElement, Station, SVGElement, any> = svg
    .selectAll('job.icons')
    .data(nodes)
    .enter()
    .append('path')
    .on(...onClick(onStationClick))
    .attr('id', d => `${getStationId(d)}-icon`);
  setStationIcon(icons, nodeHeight, margin);
}

export function drawStations(
  svg: D3SvgSelection,
  stations: Station[],
  onStationClick: (id: string) => void,
  margin: GraphMargin,
  nodeHeight: number,
) {
  const newStations = stations.filter(node => svg.select(`#${getStationId(node)}`).empty());
  svg
    .selectAll('job')
    .data(newStations)
    .enter()
    .append('circle')
    .on(...onClick(onStationClick))
    .attr(...applyMargin(margin))
    .attr('id', getStationId)
    .attr('class', 'node')
    .attr(...setStationBackground())
    .attr('r', nodeHeight / 2)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  drawStationNames(svg, newStations, margin, nodeHeight);
  drawIcons(svg, newStations, margin, nodeHeight, onStationClick);
}
