import * as b from "bobril";
import { model } from "./model/model";

export const App = () => {
  return (
    <svg viewBox="0 0 1200 400">
      <rect x="0" y="0" width="100%" height="100%" fill="lightgray" />
      {model.creepers
        .filter(creep => creep.getPosition() !== undefined)
        .map(creep => (
          <circle
            cx={creep.getPosition()!.x}
            cy={creep.getPosition()!.y}
            r="10"
            fill="red"
          />
        ))}
    </svg>
  );
};
