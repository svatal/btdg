import { computed } from "bobx";
import { IPosition } from "./base";
import { model } from "./model";

export const creeperEasingTime = 500;

interface ICreeperPosition extends IPosition {
  calculatedAtTime: number;
  pathFragmentIdx: number;
}

export enum CreeperStateEnum {
  Waiting,
  Moving,
  // Killed,
  Finished
}

interface IWaitingCreeper {
  state: CreeperStateEnum.Waiting;
}

interface IMovingCreeper {
  state: CreeperStateEnum.Moving;
  position: ICreeperPosition;
}

interface IFinishedCreeper {
  state: CreeperStateEnum.Finished;
  finishedAtTime: number;
}

type CreeperState = IWaitingCreeper | IMovingCreeper | IFinishedCreeper;

export class Creeper {
  appearsAtTime: number;
  velocity: number;
  private _lastKnownPosition: ICreeperPosition | undefined = undefined;

  @computed getState(): CreeperState {
    // console.log('calculating creeper position', model.time)
    if (
      this._lastKnownPosition !== undefined &&
      this._lastKnownPosition.pathFragmentIdx === model.creeperPath.length
    )
      return {
        state: CreeperStateEnum.Finished,
        finishedAtTime: this._lastKnownPosition.calculatedAtTime
      };
    if (this.appearsAtTime >= model.time)
      return { state: CreeperStateEnum.Waiting };
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
      return {
        state: CreeperStateEnum.Moving,
        position: this._lastKnownPosition
      };
    }
    this._lastKnownPosition = position;
    return {
      state: CreeperStateEnum.Finished,
      finishedAtTime: this._lastKnownPosition.calculatedAtTime
    };
  }

  @computed isFinished() {
    const state = this.getState();
    return (
      state.state === CreeperStateEnum.Finished &&
      model.time - state.finishedAtTime > creeperEasingTime
    );
  }

  constructor(appearsAtTime: number, velocity: number) {
    this.appearsAtTime = appearsAtTime;
    this.velocity = velocity;
  }
}
