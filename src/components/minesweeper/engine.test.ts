import { describe, expect, it } from 'vitest';
import { createGame, placeMines, revealCell, toggleFlag, type GameState } from './engine';

const zero = () => 0;
const manualGame = (rows: number, cols: number, mineIndexes: number[]): GameState => {
  const game = createGame(rows, cols, mineIndexes.length);
  const cells = game.cells.map((cell, index) => ({ ...cell, isMine: mineIndexes.includes(index) }));
  cells.forEach((cell) => { cell.adjacent = game.cells.reduce((count, other, index) => {
    const mine = mineIndexes.includes(index); const near = Math.abs(other.row - cell.row) <= 1 && Math.abs(other.col - cell.col) <= 1 && index !== cell.row * cols + cell.col;
    return count + Number(mine && near);
  }, 0); });
  return { ...game, cells, started: true, status: 'playing' };
};

describe('Minesweeper engine', () => {
  it('creates the requested dimensions', () => { const game = createGame(9, 9, 10); expect(game.cells).toHaveLength(81); expect(game.mineCount).toBe(10); });
  it('places exactly the requested mine count', () => { const game = placeMines(createGame(), 4, 4, zero); expect(game.cells.filter((cell) => cell.isMine)).toHaveLength(10); });
  it('keeps the first cell and neighbors safe when possible', () => { const game = revealCell(createGame(), 4, 4, zero); expect(game.cells.filter((cell) => Math.abs(cell.row - 4) <= 1 && Math.abs(cell.col - 4) <= 1).every((cell) => !cell.isMine)).toBe(true); });
  it('calculates adjacent mine counts', () => { const game = placeMines(createGame(3, 3, 1), 0, 0, zero); const mine = game.cells.find((cell) => cell.isMine)!; game.cells.filter((cell) => Math.abs(cell.row - mine.row) <= 1 && Math.abs(cell.col - mine.col) <= 1 && !cell.isMine).forEach((cell) => expect(cell.adjacent).toBe(1)); });
  it('flood reveals connected empty cells and wins', () => { const game = { ...createGame(3, 3, 0), started: true, status: 'playing' as const }; const revealed = revealCell(game, 1, 1); expect(revealed.cells.every((cell) => cell.isRevealed)).toBe(true); expect(revealed.status).toBe('won'); });
  it('toggles flags', () => { const game = createGame(); const flagged = toggleFlag(game, 0, 0); expect(flagged.cells[0]?.isFlagged).toBe(true); expect(toggleFlag(flagged, 0, 0).cells[0]?.isFlagged).toBe(false); });
  it('does not reveal a flagged cell', () => { const flagged = toggleFlag(createGame(), 0, 0); const revealed = revealCell(flagged, 0, 0, zero); expect(revealed.cells[0]?.isRevealed).toBe(false); expect(revealed.started).toBe(true); });
  it('loses, reveals mines, and marks incorrect flags', () => { let game = manualGame(2, 2, [0]); game = toggleFlag(game, 1, 1); const lost = revealCell(game, 0, 0); expect(lost.status).toBe('lost'); expect(lost.cells[0]?.isRevealed).toBe(true); expect(lost.cells[3]?.isIncorrectFlag).toBe(true); });
  it('detects a win after every safe cell is revealed', () => { const game = manualGame(1, 2, [1]); expect(revealCell(game, 0, 0).status).toBe('won'); });
  it('moves from ready to playing on first reveal', () => { const game = revealCell(createGame(), 4, 4, zero); expect(game.started).toBe(true); expect(game.status).toBe('playing'); });
});
