import * as b from "bobril";
import { Tower, TowerStateEnum, shotEasingTime } from "../model/tower";
import { model } from "../model/model";

export function OnMapTower(props: { tower: Tower }) {
  const tower = props.tower;
  const towerState = tower.getState();
  return (
    <>
      <circle cx={tower.position.x} cy={tower.position.y} r="10" fill="blue" />
      <circle
        cx={tower.position.x}
        cy={tower.position.y}
        r={tower.range}
        stroke-width="1"
        stroke="blue"
        stroke-dasharray="2 5"
        fill="transparent"
      />
      {towerState.state === TowerStateEnum.Shooting && (
        <line
          x1={tower.position.x}
          y1={tower.position.y}
          x2={towerState.lastShot.x}
          y2={towerState.lastShot.y}
          stroke-width={
            3 *
            Math.sin(
              ((model.time - towerState.lastShot.firedAtTime) /
                shotEasingTime) *
                Math.PI
            )
          }
          stroke="yellow"
        />
      )}
    </>
  );
}
