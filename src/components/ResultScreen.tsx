import type { Dispatch } from "react";
import type { GameState, GameAction } from "../types";
import { useI18n } from "../i18n/context";
import { AdSense } from "./AdSense";
import { Twemoji } from "./Twemoji";
import { GameButton } from "./GameButton";

interface Props {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function ResultScreen({ state, dispatch }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      <div className="flex flex-col items-center gap-4">
        <Twemoji emoji="🐕" className="w-16 h-16 [&_img]:w-full [&_img]:h-full" />
        <h1 className="text-4xl font-bold text-warm-dark">{t.gameOver}</h1>
        <div className="flex flex-col items-center gap-1 my-2">
          <span className="text-lg text-warm-mid">{t.scoreLabel}</span>
          <span className="text-7xl font-bold text-orange leading-none">
            {state.score}
          </span>
        </div>
        <p className="text-base text-warm-mid">
          {t.reachedRound(state.round)}
        </p>
        <GameButton onClick={() => dispatch({ type: "RESTART" })}>
          {t.playAgain}
        </GameButton>
      </div>
      <div className="w-full max-w-182 min-h-22.5 flex items-center justify-center">
        <AdSense />
      </div>
    </div>
  );
}
