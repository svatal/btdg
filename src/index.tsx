import * as b from "bobril";
import { model, Creeper } from "./model";
import { App } from "./app";

model.creepers = Array.from(Array(10).keys()).map(
  i => new Creeper(b.now() + 500 * i, 0.2)
);

const startTime = b.now();
model.time = startTime;

let maxRenderTime = 0;

b.init(() => {
  const renderStartTime = b.now();
  const prevTime = model.time;
  if (model.isRunning()) {
    model.time = renderStartTime;
  }
  const result = (
    <>
      {model.time - startTime} {model.isRunning() ? "running" : "stopped"}{" "}
      {Math.round(1000 / (renderStartTime - prevTime))} fps
      <App />
    </>
  );
  const renderTime = b.now() - renderStartTime;
  maxRenderTime = Math.max(maxRenderTime, renderTime);
  console.log(
    "frame",
    "time taken:",
    renderTime,
    "max time taken:",
    maxRenderTime,
    "time since last frame",
    renderStartTime - prevTime
  );
  return result;
});