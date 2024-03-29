export interface IPosition {
  x: number;
  y: number;
}

export function getDistance(pos1: IPosition, pos2: IPosition): number {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}
