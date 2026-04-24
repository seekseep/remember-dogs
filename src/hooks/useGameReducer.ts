import { useReducer } from "react";
import type { GameState, GameAction } from "../types";
import { getDifficultyForRound, generateEvents } from "../constants";

function createRoundState(round: number): Partial<GameState> {
  const difficulty = getDifficultyForRound(round);
  const { events, finalDogsInHouse: _ } = generateEvents(difficulty);
  return {
    round,
    playPhase: "house-dropping",
    dogsInHouse: difficulty.initialDogs,
    answerInput: "",
    timeRemaining: difficulty.answerTime,
    events,
    currentEventIndex: 0,
    difficulty,
    playerAnswer: null,
    isCorrect: false,
  };
}

const initialState: GameState = {
  screen: "start",
  round: 1,
  score: 0,
  lives: 3,
  dogsInHouse: 0,
  playPhase: "house-dropping",
  answerInput: "",
  timeRemaining: 15,
  events: [],
  currentEventIndex: 0,
  difficulty: getDifficultyForRound(1),
  playerAnswer: null,
  isCorrect: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const roundState = createRoundState(1);
      return {
        ...state,
        ...roundState,
        screen: "play",
        score: 0,
        lives: 3,
      };
    }

    case "HOUSE_LANDED":
      return {
        ...state,
        playPhase: "events-playing",
      };

    case "EVENT_COMPLETE": {
      const event = state.events[state.currentEventIndex];
      if (!event) return state;

      const newDogsInHouse =
        event.type === "enter"
          ? state.dogsInHouse + 1
          : state.dogsInHouse - 1;

      const nextIndex = state.currentEventIndex + 1;
      const allDone = nextIndex >= state.events.length;

      return {
        ...state,
        dogsInHouse: newDogsInHouse,
        currentEventIndex: nextIndex,
        playPhase: allDone ? "asking" : "events-playing",
        timeRemaining: allDone ? state.difficulty.answerTime : state.timeRemaining,
      };
    }

    case "ALL_EVENTS_COMPLETE":
      return {
        ...state,
        playPhase: "asking",
        timeRemaining: state.difficulty.answerTime,
      };

    case "KEY_PRESS": {
      if (state.playPhase !== "asking") return state;

      if (action.key === "delete") {
        return {
          ...state,
          answerInput: state.answerInput.slice(0, -1),
        };
      }

      if (action.key === "submit") {
        const answer = parseInt(state.answerInput, 10);
        if (isNaN(answer)) return state;

        return {
          ...state,
          playPhase: "revealing",
          playerAnswer: answer,
          isCorrect: answer === state.dogsInHouse,
        };
      }

      // Number key
      if (state.answerInput.length >= 2) return state;
      return {
        ...state,
        answerInput: state.answerInput + action.key,
      };
    }

    case "TIMER_TICK":
      if (state.playPhase !== "asking") return state;
      if (state.timeRemaining <= 1) {
        return {
          ...state,
          timeRemaining: 0,
          playPhase: "revealing",
          playerAnswer: state.answerInput ? parseInt(state.answerInput, 10) || null : null,
          isCorrect: false,
        };
      }
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      };

    case "TIME_UP":
      return {
        ...state,
        playPhase: "revealing",
        timeRemaining: 0,
        playerAnswer: null,
        isCorrect: false,
      };

    case "REVEAL_COMPLETE": {
      const newLives = state.isCorrect ? state.lives : state.lives - 1;
      // スコア: 基本100点 + 残り時間ボーナス（残り1秒あたり10点）
      const timeBonus = state.timeRemaining * 10;
      const points = 100 + timeBonus;
      return {
        ...state,
        playPhase: state.isCorrect ? "correct" : "wrong",
        score: state.isCorrect ? state.score + points : state.score,
        lives: newLives,
      };
    }

    case "NEXT_ROUND": {
      const nextRound = state.round + 1;
      const roundState = createRoundState(nextRound);
      return {
        ...state,
        ...roundState,
      };
    }

    case "GAME_OVER":
      return {
        ...state,
        screen: "result",
      };

    case "RESTART":
      return { ...initialState };

    default:
      return state;
  }
}

export function useGameReducer() {
  return useReducer(gameReducer, initialState);
}
