import type { Dispatch } from "react";
import type { GameAction } from "../types";
import { useI18n } from "../i18n/context";
import { AdSense } from "./AdSense";
import { Twemoji } from "./Twemoji";
import { GameButton } from "./GameButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  dispatch: Dispatch<GameAction>;
}

export function StartScreen({ dispatch }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1 items-end">
          <Twemoji emoji="🏚️" className="w-12 h-12 [&_img]:w-full [&_img]:h-full" />
          <Twemoji emoji="🐕" className="w-14 h-14 [&_img]:w-full [&_img]:h-full" />
        </div>
        <h1 className="text-4xl font-bold text-warm-dark tracking-tight">
          {t.title}
        </h1>
        <p className="text-base text-warm-mid">
          {t.subtitle}
        </p>
      </div>
      <LanguageSwitcher />
      <GameButton onClick={() => dispatch({ type: "START_GAME" })}>
        {t.start}
      </GameButton>
      <div className="w-full max-w-182 min-h-22.5 flex items-center justify-center">
        <AdSense slot="start-screen" />
      </div>
    </div>
  );
}
