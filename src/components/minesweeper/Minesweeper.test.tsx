import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGame, revealCell } from './engine';
import { Minesweeper } from './Minesweeper';

const zero = () => 0;
const cells = () => screen.getAllByRole('gridcell');
const mineIndexes = () => revealCell(createGame(), 0, 0, zero).cells.map((cell, index) => cell.isMine ? index : -1).filter((index) => index >= 0);

function winGame() {
  fireEvent.click(cells()[0]!);
  const mines = new Set(mineIndexes());
  cells().forEach((cell, index) => { if (!mines.has(index) && /hidden/.test(cell.getAttribute('aria-label') ?? '')) fireEvent.click(cell); });
}

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('classic Minesweeper component', () => {
  it('has no visible New Game button and uses the smiley to reset', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    expect(screen.queryByText(/^New Game$/i)).not.toBeInTheDocument();
    const first = cells()[0]!;
    fireEvent.click(first);
    expect(first).not.toHaveAccessibleName(/hidden/);
    fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }));
    expect(cells()[0]).toHaveAccessibleName(/hidden/);
  });

  it('shows surprised, winning, and losing smiley states', () => {
    const { unmount } = render(<Minesweeper onWin={() => undefined} random={zero} />);
    const smiley = screen.getByRole('button', { name: 'Start a new game' });
    fireEvent.pointerDown(cells()[0]!, { button: 0, pointerType: 'mouse' });
    expect(smiley).toHaveAttribute('data-face', 'surprised');
    fireEvent.pointerUp(cells()[0]!);
    winGame();
    expect(smiley).toHaveAttribute('data-face', 'cool');
    unmount();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    fireEvent.click(cells()[0]!);
    fireEvent.click(cells()[mineIndexes()[0]!]!);
    expect(screen.getByRole('button', { name: 'Start a new game' })).toHaveAttribute('data-face', 'dead');
  });

  it('starts the timer only after the first valid reveal and avoids duplicate intervals after reset', () => {
    vi.useFakeTimers();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    fireEvent.contextMenu(cells()[0]!);
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.getByLabelText('0 seconds elapsed')).toBeInTheDocument();
    fireEvent.click(cells()[1]!);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByLabelText('1 seconds elapsed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }));
    fireEvent.click(cells()[0]!);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByLabelText('1 seconds elapsed')).toBeInTheDocument();
  });

  it('supports right-click, keyboard flagging, and keyboard reveal', async () => {
    const user = userEvent.setup();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    fireEvent.contextMenu(cells()[0]!);
    expect(cells()[0]).toHaveAccessibleName(/flagged/);
    fireEvent.keyDown(cells()[1]!, { key: 'f' });
    expect(cells()[1]).toHaveAccessibleName(/flagged/);
    fireEvent.keyDown(cells()[1]!, { key: 'f' });
    cells()[1]!.focus();
    await user.keyboard('{Enter}');
    expect(cells()[1]).not.toHaveAccessibleName(/hidden/);
  });

  it('supports compact flag mode without starting the timer', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    const mode = screen.getByText('Flag mode').closest('button')!;
    fireEvent.click(mode);
    expect(mode).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(cells()[0]!);
    expect(cells()[0]).toHaveAccessibleName(/flagged/);
    expect(screen.getByLabelText('0 seconds elapsed')).toBeInTheDocument();
  });

  it('turns a touch long press into one flag without revealing', () => {
    vi.useFakeTimers();
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    const first = cells()[0]!;
    fireEvent.pointerDown(first, { button: 0, pointerType: 'touch' });
    act(() => vi.advanceTimersByTime(550));
    fireEvent.pointerUp(first, { pointerType: 'touch' });
    fireEvent.click(first);
    expect(first).toHaveAccessibleName(/flagged/);
    expect(screen.getByLabelText('0 seconds elapsed')).toBeInTheDocument();
  });

  it('marks exploded mines and incorrect flags, locks input, and resets after loss', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    fireEvent.click(cells()[0]!);
    const mine = cells()[mineIndexes()[0]!]!;
    const wrong = cells().find((cell, index) => !mineIndexes().includes(index) && /hidden/.test(cell.getAttribute('aria-label') ?? ''))!;
    fireEvent.contextMenu(wrong);
    fireEvent.click(mine);
    expect(mine).toHaveAccessibleName(/exploded mine/);
    expect(wrong).toHaveAccessibleName(/incorrectly flagged/);
    const lockedLabel = cells()[1]!.getAttribute('aria-label');
    fireEvent.click(cells()[1]!);
    expect(cells()[1]).toHaveAttribute('aria-label', lockedLabel);
    fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }));
    expect(cells()[0]).toHaveAccessibleName(/hidden/);
  });

  it('detects a win once, unlocks the secret, and resets after winning', () => {
    const onWin = vi.fn();
    render(<Minesweeper onWin={onWin} random={zero} />);
    winGame();
    expect(onWin).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/You won Minesweeper/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start a new game' }));
    expect(cells()[0]).toHaveAccessibleName(/hidden/);
  });

  it('shows a stable negative mine counter when flags exceed mines', () => {
    render(<Minesweeper onWin={() => undefined} random={zero} />);
    cells().slice(0, 11).forEach((cell) => fireEvent.contextMenu(cell));
    expect(screen.getByLabelText('-1 mines remaining')).toHaveTextContent('-01');
  });
});
