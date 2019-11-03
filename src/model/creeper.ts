import { observable, computed } from "bobx";
import { IPosition } from "./base";
import { model } from "./model";

interface ICreeperPosition extends IPosition {
  calculatedAtTime: number;
  pathFragmentIdx: number;
}

export class Creeper {
  appearsAtTime: number;
  velocity: number;
  private _lastKnownPosition: ICreeperPosition | undefined = undefined;

  @computed getPosition(): ICreeperPosition | undefined {
    // console.log('calculating creeper position', model.time)
    if (this.appearsAtTime >= model.time) return undefined;
    let position: ICreeperPosition = this._lastKnownPosition || {
      ...model.creeperPath[0],
      calculatedAtTime: this.appearsAtTime,
      pathFragmentIdx: 1
    };
    let availableDistance =
      this.velocity * (model.time - position.calculatedAtTime);
    while (position.pathFragmentIdx < model.creeperPath.length) {
      const target = model.creeperPath[position.pathFragmentIdx];
      const distanceToTarget = Math.sqrt(
        Math.pow(target.x - position.x, 2) + Math.pow(target.y - position.y, 2)
      );
      // console.log("availableDistance", availableDistance, "distanceToTarget", distanceToTarget, position)
      if (distanceToTarget <= availableDistance) {
        availableDistance -= distanceToTarget;
        position = {
          ...target,
          pathFragmentIdx: position.pathFragmentIdx + 1,
          calculatedAtTime: model.time - availableDistance / this.velocity
        };
        continue;
      }
      const direction = Math.atan2(
        target.y - position.y,
        target.x - position.x
      );
      this._lastKnownPosition = {
        x: position.x + Math.cos(direction) * availableDistance,
        y: position.y + Math.sin(direction) * availableDistance,
        calculatedAtTime: model.time,
        pathFragmentIdx: position.pathFragmentIdx
      };
      return this._lastKnownPosition;
    }
    this._lastKnownPosition = position;
    return this._lastKnownPosition;
  }

  @computed isFinished() {
    const pos = this.getPosition();
    return pos && pos.pathFragmentIdx === model.creeperPath.length;
  }

  constructor(appearsAtTime: number, velocity: number) {
    this.appearsAtTime = appearsAtTime;
    this.velocity = velocity;
  }
}
