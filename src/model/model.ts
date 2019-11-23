import { computed } from "bobx";
import { IPosition } from "./base";
import { Creeper } from "./creeper";
import { Tower } from "./tower";

class Model {
  @computed isFinished() {
    console.log("isFinished?");
    return this.creepers.every(creep => creep.hasAnimationFinished());
  }

  @computed getScore() {
    console.log("getScore");
    return this.creepers.reduce(
      (acc, creeper) => (creeper.isKilled() ? acc + creeper.score : acc),
      0
    );
  }

  @computed getLives() {
    console.log("getLives");
    return 20 - this.creepers.filter(creeper => creeper.isFinished()).length;
  }

  creeperPath: IPosition[] = [
    { x: 100, y: 100 },
    { x: 1100, y: 100 },
    { x: 1100, y: 300 },
    { x: 100, y: 300 }
  ];
  @computed getFinalPosition() {
    return this.creeperPath[this.creeperPath.length - 1];
  }

  creepers: Creeper[] = [];
  towers: Tower[] = [];
}

export const model = new Model();
