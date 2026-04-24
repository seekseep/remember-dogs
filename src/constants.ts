import type { DifficultyConfig, DogEvent } from "./types";

export function getDifficultyForRound(round: number): DifficultyConfig {
  return {
    totalEvents: Math.min(2 + (round - 1), 10),
    initialDogs: round >= 4 ? Math.floor((round - 3) / 2) : 0,
    answerTime: Math.max(15 - (round - 1), 5),
    eventDelay: Math.max(1500 - (round - 1) * 80, 600),
  };
}

/**
 * イベント生成アルゴリズム:
 *
 * 1. まず最終的な犬の数（targetDogs）をランダムに決める
 *    - 範囲: 0 〜 (initialDogs + totalEvents)
 *    - ただし上限は totalEvents で到達可能な最大値
 *    - ラウンドが進むほど大きい数も出やすくなる
 *
 * 2. targetDogs に到達するイベント列を逆算して生成する
 *    - 必要な純増数 = targetDogs - initialDogs
 *    - 純増数が正なら enter が多め、負なら exit が多め
 *    - 残りのイベントは enter/exit ペアで埋めて複雑さを出す
 *
 * 3. イベント列をシャッフルする（ただし制約を守る）
 *    - どの時点でも dogsInHouse >= 0 を保証
 *    - 違反するイベントは後ろに回す
 */
export function generateEvents(difficulty: DifficultyConfig): {
  events: DogEvent[];
  finalDogsInHouse: number;
} {
  const { totalEvents, initialDogs } = difficulty;

  // 1. 最終的な犬の数を決める
  const maxPossible = initialDogs + totalEvents;
  const targetDogs = Math.floor(Math.random() * (maxPossible + 1));

  // 2. 必要な enter/exit 数を計算
  const netChange = targetDogs - initialDogs;
  // netChange を実現するために必要な最小 enter/exit
  const minEnters = Math.max(netChange, 0);
  const minExits = Math.max(-netChange, 0);
  const minRequired = minEnters + minExits;

  // 残りのイベントは enter/exit ペアで埋める
  const remaining = totalEvents - minRequired;
  const pairs = Math.floor(remaining / 2);
  const extraEnter = remaining % 2 === 1 ? 1 : 0;

  const totalEnters = minEnters + pairs + extraEnter;
  const totalExits = minExits + pairs;

  // 3. イベントリストを作る（まだ順序は未定）
  const rawEvents: Array<"enter" | "exit"> = [];
  for (let i = 0; i < totalEnters; i++) rawEvents.push("enter");
  for (let i = 0; i < totalExits; i++) rawEvents.push("exit");

  // 4. シャッフルしつつ dogsInHouse >= 0 を保証する
  const ordered = constrainedShuffle(rawEvents, initialDogs);

  // 5. DogEvent に変換
  const events: DogEvent[] = [];
  let nextDogId = initialDogs + 1;
  const dogIdsInHouse: number[] = [];
  for (let i = 1; i <= initialDogs; i++) {
    dogIdsInHouse.push(i);
  }

  for (const type of ordered) {
    const direction: "left" | "right" = Math.random() < 0.5 ? "left" : "right";

    if (type === "enter") {
      const dogId = nextDogId++;
      events.push({ type: "enter", dogId, direction });
      dogIdsInHouse.push(dogId);
    } else {
      const exitIndex = Math.floor(Math.random() * dogIdsInHouse.length);
      const dogId = dogIdsInHouse[exitIndex];
      dogIdsInHouse.splice(exitIndex, 1);
      events.push({ type: "exit", dogId, direction });
    }
  }

  // extraEnter で targetDogs と1ずれる可能性があるので実際の値を返す
  const finalDogsInHouse = dogIdsInHouse.length;
  return { events, finalDogsInHouse };
}

/**
 * enter/exit のリストをシャッフルしつつ、
 * どの時点でも dogsInHouse >= 0 になるよう並べ替える
 */
function constrainedShuffle(
  types: Array<"enter" | "exit">,
  initialDogs: number
): Array<"enter" | "exit"> {
  // Fisher-Yates シャッフル
  const shuffled = [...types];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // dogsInHouse < 0 にならないよう調整
  // 違反する exit を後ろに回す
  const result: Array<"enter" | "exit"> = [];
  const deferred: Array<"enter" | "exit"> = [];
  let dogs = initialDogs;

  for (const type of shuffled) {
    if (type === "exit" && dogs === 0) {
      deferred.push(type);
    } else {
      result.push(type);
      dogs += type === "enter" ? 1 : -1;
    }
  }

  // deferred の exit を適切な位置に挿入
  for (const type of deferred) {
    // result の中で dogs > 0 の位置を探して挿入
    let inserted = false;
    let d = initialDogs;
    for (let i = 0; i < result.length; i++) {
      d += result[i] === "enter" ? 1 : -1;
      if (d > 0) {
        result.splice(i + 1, 0, type);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      // どうしても入れられない場合は enter に変換（安全策）
      result.push("enter");
    }
  }

  return result;
}
