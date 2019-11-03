import { observable, computed } from "bobx";
import { IPosition } from "./base";
import { Creeper } from "./creeper";

class Model {
  @observable time: number;
  @computed isRunning() {
    console.log("isRunning?");
    return this.creepers.some(creep => !creep.isFinished());
  }

  creeperPath: IPosition[] = [
    { x: 100, y: 100 },
    { x: 1100, y: 100 },
    { x: 1100, y: 300 },
    { x: 100, y: 300 }
  ];
  creepers: Creeper[];
}

export const model = new Model();
