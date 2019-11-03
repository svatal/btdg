import * as b from "bobril";
import { model } from "../model/model";

export function CreeperPath() {
  return (
    <path
      d={`M ${model.creeperPath[0].x} ${
        model.creeperPath[0].y
      } ${model.creeperPath
        .slice(1)
        .map(p => `L ${p.x} ${p.y}`)
        .join(" ")}`}
      stroke="brown"
      stroke-width="10"
      fill="transparent"
      stroke-linejoin="round"
    />
  );
}
