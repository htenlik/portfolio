import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createGame, flagsRemaining, revealCell, toggleFlag, type Cell } from './engine';
import styles from './Minesweeper.module.css';

const display = (value: number) => Math.max(-99, Math.min(999, value)).toString().padStart(3, '0');
const face = { ready: '🙂', playing: '🙂', won: '😎', lost: '😵' } as const;

export function Minesweeper({ onWin }: { onWin: () => void }) {
  const [game, setGame] = useState(() => createGame()); const [seconds, setSeconds] = useState(0); const [flagMode, setFlagMode] = useState(false); const [pressed, setPressed] = useState(false); const wonReported = useRef(false);
  const reset = () => { setGame(createGame()); setSeconds(0); setFlagMode(false); wonReported.current = false; };
  useEffect(() => { if (game.status !== 'playing') return; const timer = window.setInterval(() => setSeconds((value) => Math.min(999, value + 1)), 1000); return () => clearInterval(timer); }, [game.status]);
  useEffect(() => { if (game.status === 'won' && !wonReported.current) { wonReported.current = true; onWin(); } }, [game.status, onWin]);
  const reveal = (cell: Cell) => setGame((current) => flagMode ? toggleFlag(current, cell.row, cell.col) : revealCell(current, cell.row, cell.col));
  const flag = (cell: Cell) => setGame((current) => toggleFlag(current, cell.row, cell.col));
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, cell: Cell) => { if (event.key.toLowerCase() === 'f') { event.preventDefault(); flag(cell); } };
  const label = (cell: Cell) => cell.isIncorrectFlag ? `Row ${cell.row + 1}, column ${cell.col + 1}, incorrectly flagged` : cell.isFlagged && !cell.isRevealed ? `Row ${cell.row + 1}, column ${cell.col + 1}, flagged` : !cell.isRevealed ? `Row ${cell.row + 1}, column ${cell.col + 1}, hidden` : cell.isMine ? `Row ${cell.row + 1}, column ${cell.col + 1}, mine` : `Row ${cell.row + 1}, column ${cell.col + 1}, ${cell.adjacent ? `${cell.adjacent} adjacent mines` : 'empty'}`;
  return <section className={styles.game} aria-label="Minesweeper">
    <div className={styles.toolbar}><button className="retro-button" type="button" onClick={reset}>New Game</button><button className={`${styles.flagMode} ${flagMode ? styles.enabled : ''}`} type="button" aria-pressed={flagMode} onClick={() => setFlagMode((value) => !value)}>🚩 Flag mode</button></div>
    <div className={styles.panel}><span className={styles.counter} aria-label={`${flagsRemaining(game)} mines remaining`}>{display(flagsRemaining(game))}</span><button type="button" className={styles.face} aria-label="Reset game" onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerCancel={() => setPressed(false)} onClick={reset}>{pressed ? '😮' : face[game.status]}</button><span className={styles.counter} aria-label={`${seconds} seconds elapsed`}>{display(seconds)}</span></div>
    <div className={styles.board} role="grid" aria-label="9 by 9 Minesweeper board" style={{ '--columns': game.cols } as React.CSSProperties}>
      {game.cells.map((cell) => <button type="button" role="gridcell" key={`${cell.row}-${cell.col}`} className={`${styles.cell} ${cell.isRevealed ? styles.revealed : ''} ${cell.isIncorrectFlag ? styles.incorrect : ''} ${cell.adjacent ? styles[`n${cell.adjacent}`] : ''}`} aria-label={label(cell)} aria-pressed={cell.isFlagged} onClick={() => reveal(cell)} onContextMenu={(event) => { event.preventDefault(); flag(cell); }} onKeyDown={(event) => keyboard(event, cell)} onPointerDown={(event: PointerEvent<HTMLButtonElement>) => { if (event.pointerType !== 'mouse') { const target = cell; const timer = window.setTimeout(() => flag(target), 550); event.currentTarget.dataset.longPress = String(timer); } }} onPointerUp={(event) => { const button = event.currentTarget as HTMLButtonElement; const timer = Number(button.dataset.longPress); if (timer) window.clearTimeout(timer); delete button.dataset.longPress; }}>
        <span aria-hidden="true">{cell.isIncorrectFlag ? '✕' : cell.isFlagged && !cell.isRevealed ? '⚑' : cell.isMine && cell.isRevealed ? '✹' : cell.isRevealed && cell.adjacent ? cell.adjacent : ''}</span>
      </button>)}
    </div>
    <p className={styles.help}>Reveal all safe squares. Right-click or press F to flag. On touch, use Flag mode or press and hold.</p>
    <p className="sr-only" aria-live="assertive">{game.status === 'won' ? 'You won Minesweeper. Secret file unlocked.' : game.status === 'lost' ? 'Game over. You revealed a mine.' : ''}</p>
  </section>;
}
