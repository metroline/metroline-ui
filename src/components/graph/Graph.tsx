import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Graph.module.scss';
import { PipelineJob } from '../pipelines/types/pipeline';
import { listenMany } from '../../providers/websockets/listen';
import { useSocket } from '../../providers/websockets/SocketProvider';
import { setChildren, setCol, setLayers } from './lib/tree';
import { Station } from './types/station';
import { drawLines } from './lib/draw-lines';
import { GraphMargin } from './lib/graph-margin';
import { addSvgDefs } from './lib/add-svg-defs';
import { drawStations } from './lib/draw-stations';
import { D3SvgSelection } from './types/d3-svg-selection';
import { setStationIcon } from './lib/set-station-icon';
import { setStationBackground } from './lib/set-station-background';

const margin: GraphMargin = {
  top: 50,
  left: 50,
  right: 50,
  bottom: 50,
};
const layerHeight = 150;
const colWidth = 100;
const nodeHeight = 40;

export function Graph({ pipelineId, jobs, onJobClick }: { pipelineId: string; jobs: PipelineJob[]; onJobClick: (id: string) => void }) {
  const [ref, setRef] = useState<SVGElement>();
  const socket = useSocket();

  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      return;
    }

    const nodes: Station[] = jobs?.map(job => ({
      id: job.name,
      deps: job.dependencies || [],
      meta: job,
    }));

    setChildren(nodes);
    setLayers(nodes);
    const layerCount = nodes.map(n => n.layer).reduce((a, b) => Math.max(a, b), 0) + 1;
    setCol(nodes, layerCount);
    const colCount = nodes.map(n => n.col).reduce((a, b) => Math.max(a, b), 0) + 1;

    nodes.forEach(node => {
      node.x = nodeHeight / 2 + node.col * colWidth;
      node.y = nodeHeight / 2 + node.layer * layerHeight;
    });

    const width = (colCount - 1) * colWidth + nodeHeight;
    const height = (layerCount - 1) * layerHeight + nodeHeight;

    const svg: D3SvgSelection = d3.select(ref);

    svg
      .attr('data-pipelineId', pipelineId)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    addSvgDefs(svg);
    drawLines(svg, nodes, margin);
    drawStations(svg, nodes, onJobClick, margin, nodeHeight);
  }, [ref, jobs, onJobClick, pipelineId]);

  useEffect(
    () => listenMany(
      socket,
        jobs?.map(job => ({
          event: `job.${job._id}.status`,
          listener: status => {
            if (ref) {
              d3.select(ref)
                .select(`#station-${job._id}`)
                .attr(...setStationBackground(status));
              const icons = d3.select(ref).select(`#station-${job._id}-icon`);
              setStationIcon(icons, nodeHeight, margin, status);
            }
          },
        })),
    ),
    [socket, pipelineId, jobs, ref],
  );

  return <svg ref={setRef} />;
}
