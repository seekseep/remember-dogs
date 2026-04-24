import { useEffect, useMemo, useState } from "react";
import type { Dispatch } from "react";
import type { GameState, GameAction } from "../types";
import { useI18n } from "../i18n/context";
import { useRoundAnimations } from "../hooks/useRoundAnimations";
import { useTimer } from "../hooks/useTimer";
import { useSquareRem } from "../hooks/useSquareRem";
import { House } from "./House";
import { Dog } from "./Dog";
import { QuestionOverlay } from "./QuestionOverlay";
import { Twemoji } from "./Twemoji";

interface Props {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function PlayScreen({ state, dispatch }: Props) {
  const { playPhase, currentEventIndex, events, difficulty, round } = state;
  const { t } = useI18n();

  useSquareRem();

  const { currentEvent, handleEventComplete } = useRoundAnimations(
    playPhase,
    currentEventIndex,
    events,
    difficulty,
    dispatch
  );

  useTimer(playPhase, dispatch);

  // 初期犬の上昇が完了したかどうか
  const hasInitialDogs = difficulty.initialDogs > 0;
  const [dogsRisen, setDogsRisen] = useState(!hasInitialDogs);

  // ラウンドが変わったらリセット
  useEffect(() => {
    setDogsRisen(!hasInitialDogs);
  }, [round, hasInitialDogs]);

  // Random positions for revealed dogs (area: 25rem x 25rem, dog: 8rem)
  const dogPositions = useMemo(() => {
    const areaSize = 25;
    const dogSize = 8;
    const max = areaSize - dogSize;
    return Array.from({ length: state.dogsInHouse }, () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * max,
        y: Math.random() * max,
        fleeDx: Math.cos(angle) * 80,
        fleeDy: Math.sin(angle) * 80,
      };
    });
  }, [state.dogsInHouse, round]);

  // Revealing → correct/wrong after delay
  useEffect(() => {
    if (playPhase === "revealing") {
      const timer = setTimeout(() => dispatch({ type: "REVEAL_COMPLETE" }), 2500);
      return () => clearTimeout(timer);
    }
  }, [playPhase, dispatch]);

  // Handle correct/wrong phase transitions
  useEffect(() => {
    if (playPhase === "correct") {
      const timer = setTimeout(() => dispatch({ type: "NEXT_ROUND" }), 1500);
      return () => clearTimeout(timer);
    }
    if (playPhase === "wrong") {
      if (state.lives <= 0) {
        const timer = setTimeout(() => dispatch({ type: "GAME_OVER" }), 2000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => dispatch({ type: "NEXT_ROUND" }), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [playPhase, state.lives, dispatch]);

  const showHouse =
    playPhase !== "correct" &&
    playPhase !== "wrong" &&
    playPhase !== "revealing";
  const isHouseDropping = playPhase === "house-dropping" && dogsRisen;

  // 初期犬を表示: house-dropping 中で家がまだ着地していない間
  const showInitialDogs = playPhase === "house-dropping" && hasInitialDogs;

  const isRevealScreen = playPhase === "revealing" || playPhase === "correct" || playPhase === "wrong";

  let revealBg = "";
  if (playPhase === "correct") revealBg = "bg-green-500/20";
  if (playPhase === "wrong") revealBg = "bg-red-500/20";

  return (
    <div className={`w-full h-full flex flex-col items-center overflow-hidden transition-colors duration-500 ${revealBg || "bg-warm-bg"}`}>
      {/* Header: round and score - fixed at top */}
      <div
        className="flex justify-between items-center font-bold text-warm-dark shrink-0"
        style={{ width: "100rem", fontSize: "4rem", padding: "2rem 2rem 1rem" }}
      >
        <div>{t.round(round)}</div>
        <div className="flex items-center" style={{ gap: "1rem" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-opacity duration-500"
              style={{
                width: "7rem",
                height: "7rem",
                padding: "0.5rem",
                backgroundColor: i < state.lives ? "rgba(139, 90, 43, 0.2)" : "rgba(139, 90, 43, 0.05)",
                opacity: i < state.lives ? 1 : 0.3,
              }}
            >
              <Twemoji
                emoji="🦴"
                className="[&_img]:w-full [&_img]:h-full"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
        <div>{t.score(state.score)}</div>
      </div>

      {/* Center the square in remaining space - clips at screen edge */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
      {/* Square game area - overflow visible so animations show beyond square */}
      <div
        className="relative overflow-visible shrink-0"
        style={{ width: "100rem", height: "100rem" }}
      >

        {/* Initial dogs: rise from bottom, stay until house covers them */}
        {showInitialDogs && (
          <>
            <div
              className="absolute left-1/2 -translate-x-1/2 z-50 text-warm-mid"
              style={{ top: "8rem", fontSize: "1.8rem", padding: "0.5rem 1.5rem" }}
            >
              {t.initialDogs(difficulty.initialDogs)}
            </div>
            <div
              className="absolute top-1/2 left-1/2 flex z-5"
              style={{
                gap: "1rem",
                ...(dogsRisen
                  ? { transform: "translate(-50%, -50%)" }
                  : { animation: "dogs-rise 1200ms ease-out forwards" }
                ),
              }}
              onAnimationEnd={!dogsRisen ? () => setDogsRisen(true) : undefined}
            >
              {Array.from({ length: difficulty.initialDogs }).map((_, i) => (
                <Twemoji
                  key={i}
                  emoji="🐕"
                  className="[&_img]:w-full [&_img]:h-full"
                  style={{ width: "15rem", height: "15rem" }}
                />
              ))}
            </div>
          </>
        )}

        {/* House: only starts dropping after dogs have risen */}
        {showHouse && dogsRisen && (
          <House
            dropping={isHouseDropping}
            onLanded={() => dispatch({ type: "HOUSE_LANDED" })}
          />
        )}

        {/* Reveal screen */}
        {isRevealScreen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div
              className="absolute top-1/2 left-1/2 z-10"
              style={{
                animation: "house-rise 800ms ease-out forwards",
              }}
            >
              <Twemoji
                emoji="🏚️"
                className="[&_img]:w-full [&_img]:h-full"
                style={{ width: "20rem", height: "20rem" }}
              />
            </div>

            <div
              className="relative"
              style={{
                width: "25rem",
                height: "25rem",
                marginTop: "8rem",
              }}
            >
              {dogPositions.map((pos, i) => (
                <Twemoji
                  key={i}
                  emoji="🐕"
                  className="absolute [&_img]:w-full [&_img]:h-full"
                  style={{
                    width: "8rem",
                    height: "8rem",
                    left: `${pos.x}rem`,
                    top: `${pos.y}rem`,
                    ...(playPhase === "correct"
                      ? { animation: `dog-shake 0.5s ease-in-out ${i * 0.05}s infinite` }
                      : playPhase === "wrong"
                      ? {
                          "--flee-x": `${pos.x}rem`,
                          "--flee-y": `${pos.y}rem`,
                          "--flee-dx": `${pos.fleeDx}rem`,
                          "--flee-dy": `${pos.fleeDy}rem`,
                          animation: `dog-flee 0.4s ${i * 0.05}s ease-in forwards`,
                        } as React.CSSProperties
                      : {}),
                  }}
                />
              ))}
            </div>

            <div
              className="font-bold text-warm-dark"
              style={{ fontSize: "4rem", marginTop: "3rem" }}
            >
              {t.dogCount(state.dogsInHouse)}
            </div>

            <div
              className={`font-bold transition-opacity duration-300 ${
                playPhase === "correct" ? "text-green-700 opacity-100"
                : playPhase === "wrong" ? "text-red-700 opacity-100"
                : "opacity-0"
              }`}
              style={{ fontSize: "5rem", marginTop: "2rem" }}
            >
              {playPhase === "correct" ? t.correct : t.wrong}
            </div>
          </div>
        )}

        {/* Current dog animation */}
        {currentEvent && (
          <Dog
            key={`${currentEventIndex}-${currentEvent.dogId}`}
            action={currentEvent.type}
            direction={currentEvent.direction}
            onComplete={handleEventComplete}
          />
        )}

      </div>
      </div>

      {/* Question overlay */}
      {playPhase === "asking" && (
        <QuestionOverlay
          answerInput={state.answerInput}
          timeRemaining={state.timeRemaining}
          totalTime={state.difficulty.answerTime}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
