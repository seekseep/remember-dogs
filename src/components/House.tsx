import { Twemoji } from "./Twemoji";

interface Props {
  dropping: boolean;
  onLanded: () => void;
}

export function House({ dropping, onLanded }: Props) {
  return (
    <div
      className="leading-none absolute top-1/2 left-1/2 z-10"
      style={{
        transform: dropping ? undefined : "translate(-50%, -50%)",
        animation: dropping
          ? "house-drop 1200ms ease-out forwards"
          : undefined,
      }}
      onAnimationEnd={dropping ? onLanded : undefined}
    >
      <Twemoji
        emoji="🏚️"
        className="[&_img]:w-full [&_img]:h-full"
        style={{ width: "20rem", height: "20rem" }}
      />
    </div>
  );
}
