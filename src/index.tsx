import * as b from "bobril";
import { model } from "./model/model";
import { App } from "./app";
import { Creeper } from "./model/creeper";
import { Tower } from "./model/tower";
import { time } from "./model/time";
import { Button } from "./view/button";

model.creepers = Array.from(Array(10).keys()).map(
  i => new Creeper(500 * i, 0.2, 100)
);
model.towers = [
  new Tower({ x: 1000, y: 200 }, 200, 500, 25),
  new Tower({ x: 300, y: 200 }, 150, 1000, 50)
];

b.init(() => {
  const lastFrameDuration = b.lastFrameDuration();

  const result = (
    <>
      {lastFrameDuration} {model.isFinished() ? "finished" : "running"}{" "}
      {Math.min(60, Math.round(1000 / lastFrameDuration))} fps
      {time.isRunning() ? (
        <Button text="Pause" onClick={() => time.pause()} />
      ) : (
        <Button text="Start/Resume" onClick={() => time.start()} />
      )}
      <br />
      Lives: {model.getLives()} Score: {model.getScore()}
      <App />
    </>
  );
  if (!model.isFinished()) {
    time.tick();
  }
  return result;
});
