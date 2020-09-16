import { Line } from '../types/line';
import { Station } from '../types/station';

function setChildrenLayer(node: Station, nodes: Station[]) {
  if (!node.children) {
    return;
  }
  node.children.forEach(childId => {
    const child = nodes.find(n => n.id === childId);
    const childLayer = node.layer + 1;
    if (child.layer === undefined || child.layer === null || child.layer < childLayer) {
      child.layer = childLayer;
    }
    setChildrenLayer(child, nodes);
  });
}

export function setLayers(nodes: Station[]) {
  nodes
    .filter(n => !n.deps || n.deps.length === 0)
    .forEach(node => {
      node.layer = 0;
      setChildrenLayer(node, nodes);
    });
}

export function setChildren(nodes: Station[]) {
  nodes
    .filter(node => !!node.deps)
    .forEach(node => {
      node.deps.forEach(parentId => {
        const parent = nodes.find(n => n.id === parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [node.id];
          } else {
            parent.children.push(node.id);
          }
        }
      });
    });
}

// TODO should sort each node on layer
export function setCol(nodes: Station[], layerCount: number) {
  for (let rank = 0; rank < layerCount; rank++) {
    nodes.filter(n => n.layer === rank)
      .forEach((node, index) => {
        node.col = index;
      });
  }
}

export function getLines(nodes: Station[]): Line[] {
  const lines = [];
  nodes
    .filter(node => !!node.children)
    .forEach(node => {
      node.children.forEach(child => {
        lines.push({ from: node, to: nodes.find(n => n.id === child) });
      });
    });
  return lines;
}
