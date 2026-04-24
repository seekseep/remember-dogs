import type { Dispatch } from "react";
import type { GameAction } from "../types";
import { useI18n } from "../i18n/context";
import { NumberKeyboard } from "./NumberKeyboard";
import { TimerBar } from "./TimerBar";

interface Props {
  answerInput: string;
  timeRemaining: number;
  totalTime: number;
  dispatch: Dispatch<GameAction>;
}

export function QuestionOverlay({
  answerInput,
  totalTime,
  dispatch,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div
        className="bg-amber-50 flex flex-col items-center shadow-2xl w-full"
        style={{
          borderRadius: "3rem",
          padding: "4rem 3rem",
          gap: "2rem",
          maxWidth: "85rem",
        }}
      >
        <div className="flex items-center font-bold text-warm-dark" style={{ gap: "1rem", fontSize: "4.5rem" }}>
          <span>{t.question}</span>
        </div>
        <TimerBar duration={totalTime} />
        <div
          className="font-bold text-gray-800 flex items-center justify-center bg-white border-gray-300"
          style={{
            fontSize: "8rem",
            minWidth: "15rem",
            minHeight: "10rem",
            borderRadius: "1.5rem",
            borderWidth: "0.3rem",
            padding: "0.5rem 3rem",
          }}
        >
          {answerInput || <span className="text-gray-300">?</span>}
        </div>
        <NumberKeyboard dispatch={dispatch} />
      </div>
    </div>
  );
}
