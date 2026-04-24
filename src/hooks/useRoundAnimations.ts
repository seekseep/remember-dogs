import { useCallback, useEffect, useRef } from "react";
import type { Dispatch } from "react";
import type { GameAction, PlayPhase, DogEvent, DifficultyConfig } from "../types";

export function useRoundAnimations(
  playPhase: PlayPhase,
  currentEventIndex: number,
  events: DogEvent[],
  difficulty: DifficultyConfig,
  dispatch: Dispatch<GameAction>
) {
  const timeoutRef = useRef<number | null>(null);

  // Clean up timeout on unmount or phase change
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [playPhase]);

  const handleEventComplete = useCallback(() => {
    // Add delay before dispatching EVENT_COMPLETE to give visual breathing room
    timeoutRef.current = window.setTimeout(() => {
      dispatch({ type: "EVENT_COMPLETE" });
    }, difficulty.eventDelay);
  }, [dispatch, difficulty.eventDelay]);

  const currentEvent =
    playPhase === "events-playing" && currentEventIndex < events.length
      ? events[currentEventIndex]
      : null;

  return { currentEvent, handleEventComplete };
}
