export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';
export interface Cell { row: number; col: number; isMine: boolean; adjacent: number; isRevealed: boolean; isFlagged: boolean; isIncorrectFlag: boolean }
export interface GameState { rows: number; cols: number; mineCount: number; cells: Cell[]; status: GameStatus; started: boolean }
export type RandomSource = () => number;

const indexOf = (state: Pick<GameState, 'cols'>, row: number, col: number) => row * state.cols + col;
const inBounds = (state: Pick<GameState, 'rows' | 'cols'>, row: number, col: number) => row >= 0 && col >= 0 && row < state.rows && col < state.cols;
const neighbors = (state: Pick<GameState, 'rows' | 'cols'>, row: number, col: number) => {
  const result: number[] = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
    if ((rowOffset !== 0 || colOffset !== 0) && inBounds(state, row + rowOffset, col + colOffset)) result.push(indexOf(state, row + rowOffset, col + colOffset));
  }
  return result;
};

export function createGame(rows = 9, cols = 9, mineCount = 10): GameState {
  if (rows < 1 || cols < 1 || mineCount < 0 || mineCount >= rows * cols) throw new Error('Invalid Minesweeper dimensions');
  return { rows, cols, mineCount, status: 'ready', started: false, cells: Array.from({ length: rows * cols }, (_, index) => ({ row: Math.floor(index / cols), col: index % cols, isMine: false, adjacent: 0, isRevealed: false, isFlagged: false, isIncorrectFlag: false })) };
}

export function placeMines(game: GameState, safeRow: number, safeCol: number, random: RandomSource = Math.random): GameState {
  const cells = game.cells.map((cell) => ({ ...cell, isMine: false, adjacent: 0 }));
  const safe = new Set([indexOf(game, safeRow, safeCol), ...neighbors(game, safeRow, safeCol)]);
  let candidates = cells.map((_, index) => index).filter((index) => !safe.has(index));
  if (candidates.length < game.mineCount) candidates = cells.map((_, index) => index).filter((index) => index !== indexOf(game, safeRow, safeCol));
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.min(.999999999, Math.max(0, random())) * (index + 1));
    [candidates[index], candidates[swap]] = [candidates[swap]!, candidates[index]!];
  }
  candidates.slice(0, game.mineCount).forEach((index) => { cells[index]!.isMine = true; });
  cells.forEach((cell) => { if (!cell.isMine) cell.adjacent = neighbors(game, cell.row, cell.col).filter((index) => cells[index]!.isMine).length; });
  return { ...game, cells, status: 'playing', started: true };
}

export function revealCell(game: GameState, row: number, col: number, random: RandomSource = Math.random): GameState {
  if (!inBounds(game, row, col) || game.status === 'won' || game.status === 'lost') return game;
  const next = game.started ? game : placeMines(game, row, col, random);
  const targetIndex = indexOf(next, row, col); const target = next.cells[targetIndex]!;
  if (target.isFlagged || target.isRevealed) return next;
  const cells = next.cells.map((cell) => ({ ...cell }));
  if (target.isMine) {
    cells.forEach((cell) => { if (cell.isMine) cell.isRevealed = true; if (cell.isFlagged && !cell.isMine) cell.isIncorrectFlag = true; });
    return { ...next, cells, status: 'lost' };
  }
  const queue = [targetIndex]; const visited = new Set<number>();
  while (queue.length) {
    const currentIndex = queue.shift()!; if (visited.has(currentIndex)) continue; visited.add(currentIndex);
    const cell = cells[currentIndex]!; if (cell.isFlagged || cell.isMine) continue; cell.isRevealed = true;
    if (cell.adjacent === 0) neighbors(next, cell.row, cell.col).forEach((neighbor) => { if (!visited.has(neighbor)) queue.push(neighbor); });
  }
  const won = cells.every((cell) => cell.isMine || cell.isRevealed);
  return { ...next, cells, status: won ? 'won' : 'playing' };
}

export function toggleFlag(game: GameState, row: number, col: number): GameState {
  if (!inBounds(game, row, col) || game.status === 'won' || game.status === 'lost') return game;
  const targetIndex = indexOf(game, row, col); const target = game.cells[targetIndex]!;
  if (target.isRevealed) return game;
  const cells = game.cells.map((cell, index) => index === targetIndex ? { ...cell, isFlagged: !cell.isFlagged } : cell);
  return { ...game, cells };
}

export const flagsRemaining = (game: GameState) => game.mineCount - game.cells.filter((cell) => cell.isFlagged).length;
