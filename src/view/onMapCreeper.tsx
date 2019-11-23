import * as b from "bobril";
import { Creeper, CreeperStateEnum, creeperEasingTime } from "../model/creeper";
import { model } from "../model/model";
import { time } from "../model/time";

export function OnMapCreeper(props: { creeper: Creeper }) {
  const creeper = props.creeper;
  const creeperState = creeper.getState();
  switch (creeperState.state) {
    case CreeperStateEnum.Moving:
      return (
        <>
          <circle
            cx={creeperState.position.x}
            cy={creeperState.position.y}
            r="10"
            fill="red"
          />
          <rect
            x={creeperState.position.x - 10}
            y={creeperState.position.y - 13}
            height="2"
            width={(20 * creeper.hitPoints) / creeper.maxHitPoints}
            fill="red"
          />
        </>
      );
    case CreeperStateEnum.Finished:
      if (creeperState.finishedAtTime + creeperEasingTime > time.gameTime) {
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
      (((time.gameTime - finishedAtTime) / creeperEasingTime) * Math.PI * 5) /
        6 +
        Math.PI / 6
    )
  );
}
