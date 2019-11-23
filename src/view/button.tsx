import * as b from "bobril";

export function Button(props: { text: string; onClick: () => void }) {
  return (
    <input
      type="button"
      value={props.text}
      onClick={() => {
        props.onClick();
        return true;
      }}
    />
  );
}
