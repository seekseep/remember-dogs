import { useEffect, useRef } from "react";
import type { Dispatch } from "react";
import type { GameAction, PlayPhase } from "../types";

export function useTimer(playPhase: PlayPhase, dispatch: Dispatch<GameAction>) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (playPhase === "asking") {
      intervalRef.current = window.setInterval(() => {
        dispatch({ type: "TIMER_TICK" });
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playPhase, dispatch]);
}
