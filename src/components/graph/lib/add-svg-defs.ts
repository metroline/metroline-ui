import { PipelineJobStatus } from '../../pipelines/types/pipeline';
import { D3SvgSelection } from '../types/d3-svg-selection';

const gradiants = [
  // $_orangeGradient: linear-gradient(250.75deg, #FCA326 0%, #E24329 100%)
  {
    id: 'orangeGradient',
    angle: '250.75deg',
    start: { color: '#FCA326', offset: '0%' },
    stop: { color: '#E24329', offset: '100%' },
  },
  // $_greenGradient: linear-gradient(225deg, #50E69B 0%, #1DBE6D 100%)
  {
    id: 'greenGradient',
    angle: '225deg',
    start: { color: '#50E69B', offset: '0%' },
    stop: { color: '#1DBE6D', offset: '100%' },
  },
  // $_redGradient: linear-gradient(225deg, #F4719D 0%, #EC135B 100%)
  {
    id: 'redGradient',
    angle: '225deg',
    start: { color: '#F4719D', offset: '0%' },
    stop: { color: '#EC135B', offset: '100%' },
  },
  // $_blueGradient: linear-gradient(60.72deg, #1D56C9 0%, #33BBFF 100%)
  {
    id: 'blueGradient',
    angle: '60.72deg',
    start: { color: '#1D56C9', offset: '0%' },
    stop: { color: '#33BBFF', offset: '100%' },
  },
  // $_spaceGradient: linear-gradient(184.01deg, #7153AC 0%, #1B0449 100%);
  {
    id: 'spaceGradient',
    angle: '184.01deg',
    start: { color: '#7153AC', offset: '0%' },
    stop: { color: '#1B0449', offset: '100%' },
  },
];

export function addSvgDefs(svg: D3SvgSelection) {
  svg
    .append('defs')
    .selectAll('defs.gradients')
    .data(gradiants)
    .enter()
    .append('linearGradient')
    .attr('id', d => d.id)
    // TODO not working as expected
    // .attr('gradientTransform', d => `rotate(${d.angle.replace('deg', '')})`)
    // .attr('x1', '0%')
    // .attr('x2', '100%')
    // .attr('y1', '0%')
    // .attr('y2', '0%')
    .call(selection => {
      selection
        .append('stop')
        .attr('offset', d => d.start.offset)
        .attr('style', d => `stop-color:${d.start.color}`);
      selection
        .append('stop')
        .attr('offset', d => d.stop.offset)
        .attr('style', d => `stop-color:${d.stop.color}`);
    });
}

export function getGradient(status: PipelineJobStatus, allowFailure: boolean) {
  switch (status) {
    case 'success':
      return 'greenGradient';
    case 'failure':
      return allowFailure ? 'orangeGradient' : 'redGradient';
    case 'cancelled':
    case 'skipped':
      return 'spaceGradient';
    case 'created':
    case 'running':
    default:
      return 'blueGradient';
  }
}
