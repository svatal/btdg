import * as b from "bobril";
import { model } from "./model/model";
import { OnMapCreeper } from "./view/onMapCreeper";

export const App = () => {
  return (
    <svg viewBox="0 0 1200 400">
      <rect x="0" y="0" width="100%" height="100%" fill="lightgray" />
      {model.creepers.map(creeper => (
        <OnMapCreeper creeper={creeper} />
      ))}
    </svg>
  );
};
