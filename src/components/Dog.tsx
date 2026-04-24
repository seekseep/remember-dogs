import { Twemoji } from "./Twemoji";

interface Props {
  action: "enter" | "exit";
  direction: "left" | "right";
  onComplete: () => void;
}

const animationMap = {
  "enter-left": "enter-left",
  "enter-right": "enter-right",
  "exit-left": "exit-left",
  "exit-right": "exit-right",
} as const;

export function Dog({ action, direction, onComplete }: Props) {
  const animName = animationMap[`${action}-${direction}`];

  // 犬の絵文字は左向き。右へ移動するときは反転する
  const movingRight =
    (action === "enter" && direction === "left") ||
    (action === "exit" && direction === "right");

  return (
    <div
      className="leading-none absolute top-1/2 left-1/2 z-5"
      style={{
        animation: `${animName} 2000ms ease-in-out forwards`,
      }}
      onAnimationEnd={onComplete}
    >
      <Twemoji
        emoji="🐕"
        className={`[&_img]:w-full [&_img]:h-full ${movingRight ? "[&_img]:-scale-x-100" : ""}`}
        style={{ width: "15rem", height: "15rem" }}
      />
    </div>
  );
}
