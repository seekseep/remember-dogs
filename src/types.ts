export type Screen = "start" | "play" | "result";

export type PlayPhase =
  | "house-dropping"
  | "events-playing"
  | "asking"
  | "revealing"
  | "correct"
  | "wrong";

export interface DogEvent {
  type: "enter" | "exit";
  dogId: number;
  direction: "left" | "right";
}

export interface DifficultyConfig {
  totalEvents: number;
  initialDogs: number;
  answerTime: number;
  eventDelay: number;
}

export interface GameState {
  screen: Screen;
  round: number;
  score: number;
  lives: number;
  dogsInHouse: number;
  playPhase: PlayPhase;
  answerInput: string;
  timeRemaining: number;
  events: DogEvent[];
  currentEventIndex: number;
  difficulty: DifficultyConfig;
  playerAnswer: number | null;
  isCorrect: boolean;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "HOUSE_LANDED" }
  | { type: "EVENT_COMPLETE" }
  | { type: "ALL_EVENTS_COMPLETE" }
  | { type: "KEY_PRESS"; key: string }
  | { type: "TIMER_TICK" }
  | { type: "TIME_UP" }
  | { type: "REVEAL_COMPLETE" }
  | { type: "NEXT_ROUND" }
  | { type: "GAME_OVER" }
  | { type: "RESTART" };
