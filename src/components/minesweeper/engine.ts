export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';
export const difficulties: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  Beginner: { rows: 9, cols: 9, mines: 10 },
  Intermediate: { rows: 16, cols: 16, mines: 40 },
  Expert: { rows: 16, cols: 30, mines: 99 },
};
export interface Cell { row: number; col: number; isMine: boolean; adjacent: number; isRevealed: boolean; isFlagged: boolean; isQuestion: boolean; isIncorrectFlag: boolean; isExploded: boolean }
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
  return { rows, cols, mineCount, status: 'ready', started: false, cells: Array.from({ length: rows * cols }, (_, index) => ({ row: Math.floor(index / cols), col: index % cols, isMine: false, adjacent: 0, isRevealed: false, isFlagged: false, isQuestion: false, isIncorrectFlag: false, isExploded: false })) };
}

export function placeMines(game: GameState, safeRow: number, safeCol: number, random: RandomSource = Math.random): GameState {
  const cells = game.cells.map((cell) => ({ ...cell, isMine: false, adjacent: 0 }));
  const safeIndex = indexOf(game, safeRow, safeCol);
  const candidates = cells.map((_, index) => index).filter((index) => index !== safeIndex);
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.min(.999999999, Math.max(0, random())) * (index + 1));
    [candidates[index], candidates[swap]] = [candidates[swap]!, candidates[index]!];
  }
  candidates.slice(0, game.mineCount).forEach((index) => { cells[index]!.isMine = true; });
  cells.forEach((cell) => { if (!cell.isMine) cell.adjacent = neighbors(game, cell.row, cell.col).filter((index) => cells[index]!.isMine).length; });
  return { ...game, cells, status: 'playing', started: true };
}

const loseGame = (game: GameState, explodedIndex: number): GameState => {
  const cells = game.cells.map((cell, index) => ({
    ...cell,
    isRevealed: cell.isMine ? true : cell.isRevealed,
    isIncorrectFlag: cell.isFlagged && !cell.isMine,
    isExploded: index === explodedIndex,
  }));
  return { ...game, cells, status: 'lost' };
};

const revealSafeCells = (game: GameState, startIndexes: readonly number[]): GameState => {
  const cells = game.cells.map((cell) => ({ ...cell }));
  const queue = [...startIndexes];
  const visited = new Set<number>();
  while (queue.length) {
    const currentIndex = queue.shift()!;
    if (visited.has(currentIndex)) continue;
    visited.add(currentIndex);
    const cell = cells[currentIndex]!;
    if (cell.isFlagged || cell.isMine) continue;
    cell.isRevealed = true;
    if (cell.adjacent === 0) neighbors(game, cell.row, cell.col).forEach((neighbor) => {
      if (!visited.has(neighbor)) queue.push(neighbor);
    });
  }
  const won = cells.every((cell) => cell.isMine || cell.isRevealed);
  return { ...game, cells, status: won ? 'won' : 'playing' };
};

export function revealCell(game: GameState, row: number, col: number, random: RandomSource = Math.random): GameState {
  if (!inBounds(game, row, col) || game.status === 'won' || game.status === 'lost') return game;
  const originalTarget = game.cells[indexOf(game, row, col)]!;
  if (originalTarget.isFlagged || originalTarget.isRevealed) return game;
  const next = game.started ? game : placeMines(game, row, col, random);
  const targetIndex = indexOf(next, row, col); const target = next.cells[targetIndex]!;
  return target.isMine ? loseGame(next, targetIndex) : revealSafeCells(next, [targetIndex]);
}

/**
 * Classic chording behavior, independently implemented after reviewing the
 * MIT-licensed AkshayKalose/Minesweeper-XP interaction model.
 */
export function chordCell(game: GameState, row: number, col: number): GameState {
  if (!inBounds(game, row, col) || game.status !== 'playing') return game;
  const target = game.cells[indexOf(game, row, col)]!;
  if (!target.isRevealed || target.adjacent < 1) return game;
  const nearby = neighbors(game, row, col);
  if (nearby.filter((index) => game.cells[index]!.isFlagged).length !== target.adjacent) return game;
  const covered = nearby.filter((index) => !game.cells[index]!.isRevealed && !game.cells[index]!.isFlagged);
  const mine = covered.find((index) => game.cells[index]!.isMine);
  return mine === undefined ? revealSafeCells(game, covered) : loseGame(game, mine);
}

export function toggleFlag(game: GameState, row: number, col: number): GameState {
  if (!inBounds(game, row, col) || game.status === 'won' || game.status === 'lost') return game;
  const targetIndex = indexOf(game, row, col); const target = game.cells[targetIndex]!;
  if (target.isRevealed) return game;
  const cells = game.cells.map((cell, index) => index === targetIndex ? { ...cell, isFlagged: !cell.isFlagged, isQuestion: false } : cell);
  return { ...game, cells };
}

export function cycleMark(game: GameState, row: number, col: number, questionMarks = true): GameState {
  if (!inBounds(game, row, col) || game.status === 'won' || game.status === 'lost') return game;
  const targetIndex = indexOf(game, row, col); const target = game.cells[targetIndex]!;
  if (target.isRevealed) return game;
  const replacement = target.isFlagged
    ? { isFlagged: false, isQuestion: questionMarks }
    : target.isQuestion
      ? { isFlagged: false, isQuestion: false }
      : { isFlagged: true, isQuestion: false };
  return { ...game, cells: game.cells.map((cell, index) => index === targetIndex ? { ...cell, ...replacement } : cell) };
}

export const flagsRemaining = (game: GameState) => game.mineCount - game.cells.filter((cell) => cell.isFlagged).length;
