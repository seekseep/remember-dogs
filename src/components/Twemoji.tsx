import { useRef, useEffect } from "react";
import twemoji from "@twemoji/api";

interface Props {
  emoji: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Twemoji({ emoji, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = emoji;
      twemoji.parse(ref.current, {
        folder: "svg",
        ext: ".svg",
      });
    }
  }, [emoji]);

  return <span ref={ref} className={className} style={style} />;
}
