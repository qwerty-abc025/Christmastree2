export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface OrnamentData {
  id: number;
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  type: 'BALL' | 'BOX' | 'LIGHT';
}
