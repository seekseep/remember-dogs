import { useEffect } from "react";

export function useSquareRem() {
  useEffect(() => {
    const update = () => {
      const side = Math.min(window.innerWidth, window.innerHeight);
      document.documentElement.style.fontSize = `${side / 100}px`;
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      document.documentElement.style.fontSize = "";
    };
  }, []);
}
