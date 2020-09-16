import * as d3 from 'd3';
import { Station } from '../types/station';
import { Line } from '../types/line';
import { getLines } from './tree';
import { applyMargin } from './apply-margin';
import { GraphMargin } from './graph-margin';
import { D3SvgSelection } from '../types/d3-svg-selection';

const strokeWidth = 7;
// ideally <= 0.5
const curveOffset = 0.5;

function lineId(line: Line): string {
  return `line-${line.from.id}-${line.to.id}`;
}

export function drawLines(svg: D3SvgSelection, nodes: Station[], margin: GraphMargin) {
  const lineData: Line[] = getLines(nodes).filter(line => svg.select(`#${lineId(line)}`).empty());
  const lineFn = d3.line().curve(d3.curveBasis);
  svg
    .selectAll('lines')
    .data(lineData)
    .enter()
    .append('path')
    .call(selection => selection.lower())
    .attr(...applyMargin(margin))
    .attr('class', 'line')
    .attr('id', lineId)
    .attr('stroke-width', strokeWidth)
    .attr('d', link => {
      const yDiff: number = Math.abs(link.from.y - link.to.y);
      const points: [number, number][] = [
        [link.from.x, link.from.y],
        [link.from.x, link.from.y + curveOffset * yDiff],
        [link.to.x, link.to.y - curveOffset * yDiff],
        [link.to.x, link.to.y],
      ];
      return lineFn(points);
    });
}
