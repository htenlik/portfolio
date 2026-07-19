import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGame, revealCell } from './engine';
import { Minesweeper } from './Minesweeper';

const zero = () => 0;
const cells = () => screen.getAllByRole('gridcell');
const left = (index: number) => { const cell = cells()[index]!; fireEvent.pointerDown(cell, { button: 0, buttons: 1, pointerType: 'mouse' }); fireEvent.pointerUp(cell, { button: 0, pointerType: 'mouse' }); };
const right = (index: number) => fireEvent.pointerDown(cells()[index]!, { button: 2, buttons: 2, pointerType: 'mouse' });
const mineIndexes = () => revealCell(createGame(), 0, 0, zero).cells.map((cell, index) => cell.isMine ? index : -1).filter((index) => index >= 0);

function winGame() {
  left(0);
  const mines = new Set(mineIndexes());
  cells().forEach((cell, index) => { if (!mines.has(index) && /hidden|question mark/.test(cell.getAttribute('aria-label') ?? '')) left(index); });
}

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('Minesweeper-XP component', () => {
  it('offers the reference Game menu and resets from the smiley', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Game' }));
    expect(screen.getByRole('menuitem', { name: /New/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Beginner' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Intermediate' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Expert' })).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Game' }));
    left(0);
    expect(cells()[0]).not.toHaveAccessibleName(/hidden/);
    fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }));
    expect(cells()[0]).toHaveAccessibleName(/hidden/);
  });

  it('switches between beginner, intermediate, and expert boards', () => {
    const onBoardSizeChange = vi.fn();
    render(<Minesweeper onWin={() => undefined} onBoardSizeChange={onBoardSizeChange} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Game' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Expert' }));
    expect(cells()).toHaveLength(480);
    expect(screen.getByRole('grid', { name: '16 by 30 Minesweeper board' })).toBeInTheDocument();
    expect(screen.getByLabelText('99 mines remaining')).toHaveAttribute('data-value', '099');
    expect(onBoardSizeChange).toHaveBeenLastCalledWith('Expert', 1);
  });

  it('shows surprised, winning, and losing face states', () => {
    const { unmount } = render(<Minesweeper onWin={() => undefined} random={zero} />);
    const smiley = screen.getByRole('button', { name: 'Start a new game' });
    fireEvent.pointerDown(cells()[0]!, { button: 0, buttons: 1, pointerType: 'mouse' });
    expect(smiley).toHaveAttribute('data-face', 'surprised');
    fireEvent.pointerUp(cells()[0]!);
    winGame();
    expect(smiley).toHaveAttribute('data-face', 'won');
    unmount();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    left(0); left(mineIndexes()[0]!);
    expect(screen.getByRole('button', { name: 'Start a new game' })).toHaveAttribute('data-face', 'lost');
  });

  it('starts the timer on the first reveal, not an initial mark', () => {
    vi.useFakeTimers();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    right(0); act(() => vi.advanceTimersByTime(1100));
    expect(screen.getByLabelText('0 seconds elapsed')).toBeInTheDocument();
    left(1); act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByLabelText('1 seconds elapsed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }));
    expect(screen.getByLabelText('0 seconds elapsed')).toBeInTheDocument();
  });

  it('supports right-click marks, question marks, and keyboard controls', async () => {
    const user = userEvent.setup();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    right(0); expect(cells()[0]).toHaveAccessibleName(/flagged/);
    right(0); expect(cells()[0]).toHaveAccessibleName(/question mark/);
    right(0); expect(cells()[0]).toHaveAccessibleName(/hidden/);
    fireEvent.keyDown(cells()[1]!, { key: 'f' }); expect(cells()[1]).toHaveAccessibleName(/flagged/);
    fireEvent.keyDown(cells()[1]!, { key: 'f' }); cells()[1]!.focus(); await user.keyboard('{Enter}');
    expect(cells()[1]).not.toHaveAccessibleName(/hidden/);
  });

  it('supports keyboard chording on an open numbered cell', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />); left(0);
    const seeded = revealCell(createGame(), 0, 0, zero);
    const numbered = seeded.cells.find((cell) => cell.isRevealed && cell.adjacent > 0)!;
    seeded.cells.filter((cell) => cell.isMine && Math.abs(cell.row - numbered.row) <= 1 && Math.abs(cell.col - numbered.col) <= 1).forEach((cell) => right(cell.row * seeded.cols + cell.col));
    const hiddenBefore = cells().filter((cell) => /hidden/.test(cell.getAttribute('aria-label') ?? '')).length;
    fireEvent.keyDown(cells()[numbered.row * seeded.cols + numbered.col]!, { key: 'c' });
    expect(cells().filter((cell) => /hidden/.test(cell.getAttribute('aria-label') ?? '')).length).toBeLessThan(hiddenBefore);
  });

  it('turns a touch long press into a mark without revealing', () => {
    vi.useFakeTimers(); render(<Minesweeper onWin={() => undefined} random={zero} />);
    fireEvent.pointerDown(cells()[0]!, { button: 0, buttons: 1, pointerType: 'touch' }); act(() => vi.advanceTimersByTime(500)); fireEvent.pointerUp(cells()[0]!, { pointerType: 'touch' });
    expect(cells()[0]).toHaveAccessibleName(/flagged/); expect(screen.getByLabelText('0 seconds elapsed')).toBeInTheDocument();
  });

  it('marks exploded mines and incorrect flags and locks the board', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />); left(0);
    const mineIndex = mineIndexes()[0]!; const wrongIndex = cells().findIndex((cell, index) => !mineIndexes().includes(index) && /hidden/.test(cell.getAttribute('aria-label') ?? ''));
    right(wrongIndex); left(mineIndex);
    expect(cells()[mineIndex]).toHaveAccessibleName(/exploded mine/); expect(cells()[wrongIndex]).toHaveAccessibleName(/incorrectly flagged/);
    const label = cells()[1]!.getAttribute('aria-label'); left(1); expect(cells()[1]).toHaveAttribute('aria-label', label);
  });

  it('detects a win once and preserves the secret unlock callback', () => {
    const onWin = vi.fn(); render(<Minesweeper onWin={onWin} random={zero} />); winGame();
    expect(onWin).toHaveBeenCalledTimes(1); expect(screen.getByText(/You won Minesweeper/)).toBeInTheDocument();
  });

  it('renders stable negative counters when marks exceed mines', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />); for (let index = 0; index < 11; index += 1) right(index);
    expect(screen.getByLabelText('-1 mines remaining')).toHaveAttribute('data-value', '-01');
  });

  it('provides working Help, theme, and scale controls', () => {
    const onBoardSizeChange = vi.fn(); render(<Minesweeper onWin={() => undefined} onBoardSizeChange={onBoardSizeChange} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Help' })); fireEvent.click(screen.getByRole('menuitem', { name: 'About Minesweeper...' }));
    expect(screen.getByRole('dialog', { name: 'About Minesweeper' })).toBeInTheDocument(); fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Help' })); fireEvent.click(screen.getByRole('menuitem', { name: 'Windows 98 Style' }));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Help' })); fireEvent.click(screen.getByRole('menuitem', { name: '2x Scale' }));
    expect(onBoardSizeChange).toHaveBeenLastCalledWith('Beginner', 2);
  });
});
