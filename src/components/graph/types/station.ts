export interface Station<T = any> {
  id: string;
  deps?: string[];
  children?: string[];
  layer?: number;
  col?: number;
  x?: number;
  y?: number;
  meta: T;
}
