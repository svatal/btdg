import { computed, observable } from "bobx";
import { IPosition, getDistance } from "./base";
import { model } from "./model";

export const creeperEasingTime = 500;
const hitFreezeTime = 100;

interface ICreeperPosition extends IPosition {
  calculatedAtTime: number;
  pathFragmentIdx: number;
}

export enum CreeperStateEnum {
  Waiting,
  Moving,
  Killed,
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

interface IDeadCreeper {
  state: CreeperStateEnum.Killed;
  killedAtTime: number;
}

type CreeperState =
  | IWaitingCreeper
  | IMovingCreeper
  | IFinishedCreeper
  | IDeadCreeper;

export class Creeper {
  appearsAtTime: number;
  velocity: number;

  maxHitPoints: number;
  @observable hitPoints: number;
  @observable hitAtTime: number | undefined = undefined;

  hit(damage: number) {
    this.hitPoints -= damage;
    this.hitAtTime = model.time;
  }

  private _lastKnownPosition: ICreeperPosition | undefined = undefined;

  @computed getState(): CreeperState {
    // console.log('calculating creeper position', model.time)
    if (this.hitPoints <= 0)
      return {
        state: CreeperStateEnum.Killed,
        killedAtTime: this.hitAtTime!
      };
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
    const moveStartTime = Math.max(
      position.calculatedAtTime,
      this.hitAtTime ? this.hitAtTime + hitFreezeTime : 0
    );
    let availableDistance =
      this.velocity * Math.max(model.time - moveStartTime, 0);
    while (position.pathFragmentIdx < model.creeperPath.length) {
      const target = model.creeperPath[position.pathFragmentIdx];
      const distanceToTarget = getDistance(target, position);
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
      state.state === CreeperStateEnum.Killed ||
      (state.state === CreeperStateEnum.Finished &&
        model.time - state.finishedAtTime > creeperEasingTime)
    );
  }

  constructor(appearsAtTime: number, velocity: number, hitPoints: number) {
    this.appearsAtTime = appearsAtTime;
    this.velocity = velocity;
    this.hitPoints = hitPoints;
    this.maxHitPoints = hitPoints;
  }
}
