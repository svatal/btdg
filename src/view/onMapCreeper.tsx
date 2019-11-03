import * as b from "bobril";
import { Creeper, CreeperStateEnum, creeperEasingTime } from "../model/creeper";
import { model } from "../model/model";

export function OnMapCreeper(props: { creeper: Creeper }) {
  const creeperState = props.creeper.getState();
  switch (creeperState.state) {
    case CreeperStateEnum.Moving:
      return (
        <circle
          cx={creeperState.position.x}
          cy={creeperState.position.y}
          r="10"
          fill="red"
        />
      );
    case CreeperStateEnum.Finished:
      if (creeperState.finishedAtTime + creeperEasingTime > model.time) {
        const position = model.getFinalPosition();
        return (
          <circle
            cx={position.x}
            cy={position.y}
            r={easeOut(creeperState.finishedAtTime)}
            fill="red"
          />
        );
      }
      return null;
    default:
      return null;
  }
}

// 10 -> 20 -> 0
function easeOut(finishedAtTime: number) {
  return (
    20 *
    Math.sin(
      (((model.time - finishedAtTime) / creeperEasingTime) * Math.PI * 5) / 6 +
        Math.PI / 6
    )
  );
}
