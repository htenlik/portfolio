import type { Difficulty } from './engine';

const eventName = 'htenlikos:launch-minesweeper';

export function requestMinesweeper(difficulty: Difficulty) {
  window.dispatchEvent(new CustomEvent<Difficulty>(eventName, { detail: difficulty }));
}

export function listenForMinesweeperRequest(handler: (difficulty: Difficulty) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<Difficulty>).detail);
  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
}
