import { GraphMargin } from './graph-margin';

export function applyMargin(margin: GraphMargin): [string, string] {
  return ['transform', `translate(${margin.left}, ${margin.top})`];
}
