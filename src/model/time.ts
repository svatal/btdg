import { observable, computed } from "bobx";
import { now } from "bobril";

class Time {
  @observable gameTime: number = 0;
  private _lastTickTime: number = 0;
  @observable private _paused: boolean = true;

  pause() {
    this._paused = true;
  }
  start() {
    this._lastTickTime = now();
    this._paused = false;
  }

  @computed isRunning() {
    return !this._paused;
  }

  tick() {
    const currentTime = now();
    if (this.isRunning()) {
      this.gameTime += currentTime - this._lastTickTime;
    }
    console.log("tick");
    this._lastTickTime = currentTime;
  }
}

export const time = new Time();
