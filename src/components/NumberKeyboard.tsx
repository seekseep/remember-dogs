import type { Dispatch } from "react";
import type { GameAction } from "../types";

interface Props {
  dispatch: Dispatch<GameAction>;
}

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["delete", "0", "submit"],
];

const labels: Record<string, string> = {
  delete: "⌫",
  submit: "OK",
};

export function NumberKeyboard({ dispatch }: Props) {
  return (
    <div className="flex flex-col w-full" style={{ gap: "1rem", maxWidth: "70rem" }}>
      {keys.map((row, i) => (
        <div key={i} className="flex" style={{ gap: "1rem" }}>
          {row.map((key) => {
            let colors = "bg-white text-gray-800 active:bg-gray-200";
            if (key === "submit") colors = "bg-green-500 text-white active:bg-green-700";
            if (key === "delete") colors = "bg-red-400 text-white active:bg-red-700";

            return (
              <button
                key={key}
                className={`flex-1 font-semibold border-none cursor-pointer select-none active:scale-95 transition-transform ${colors}`}
                style={{
                  padding: "3rem 0",
                  fontSize: "7rem",
                  borderRadius: "1.5rem",
                }}
                onClick={() => dispatch({ type: "KEY_PRESS", key })}
              >
                {labels[key] ?? key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
