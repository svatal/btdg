import { computed } from "bobx";
import { IPosition, getDistance } from "./base";
import { model } from "./model";
import { CreeperStateEnum } from "./creeper";
import { time } from "./time";

export const shotEasingTime = 200;

interface ITowerShot extends IPosition {
  firedAtTime: number;
}

export enum TowerStateEnum {
  Shooting,
  Reloading,
  Idle
}

interface ITowerShooting {
  state: TowerStateEnum.Shooting;
  lastShot: ITowerShot;
}

interface ITowerReloading {
  state: TowerStateEnum.Reloading;
}

interface ITowerIdle {
  state: TowerStateEnum.Idle;
}

type TowerState = ITowerShooting | ITowerReloading | ITowerIdle;

export class Tower {
  position: IPosition;
  range: number;
  damage: number;
  fireRate: number;

  lastShot: ITowerShot | undefined = undefined;

  @computed getState(): TowerState {
    if (
      this.lastShot !== undefined &&
      this.lastShot.firedAtTime + shotEasingTime >= time.gameTime
    )
      return { state: TowerStateEnum.Shooting, lastShot: this.lastShot };
    if (
      this.lastShot !== undefined &&
      this.lastShot.firedAtTime + this.fireRate >= time.gameTime
    )
      return { state: TowerStateEnum.Reloading };
    const creepers = this.getCreepersInRange();
    for (let i = 0; i < creepers.length; i++) {
      const creeper = creepers[i];
      const creeperState = creeper.getState();
      if (creeperState.state === CreeperStateEnum.Moving) {
        this.lastShot = {
          x: creeperState.position.x,
          y: creeperState.position.y,
          firedAtTime: time.gameTime
        };
        // TODO: find a better way - update needs to be postponed otherwise we are changing data that the calculation is based on
        setTimeout(() => creeper.hit(this.damage), 0);

        return { state: TowerStateEnum.Shooting, lastShot: this.lastShot };
      }
    }
    return { state: TowerStateEnum.Idle };
  }

  private getCreepersInRange() {
    return model.creepers.filter(creeper => {
      const creeperState = creeper.getState();
      return (
        creeperState.state === CreeperStateEnum.Moving &&
        getDistance(this.position, creeperState.position) < this.range
      );
    });
  }

  constructor(
    position: IPosition,
    range: number,
    fireRate: number,
    damage: number
  ) {
    this.position = position;
    this.range = range;
    this.fireRate = fireRate;
    this.damage = damage;
  }
}
