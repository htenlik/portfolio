import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { chordCell, createGame, flagsRemaining, revealCell, toggleFlag, type Cell, type GameStatus, type RandomSource } from './engine';
import styles from './Minesweeper.module.css';

const display = (value: number) => value < 0 ? `-${Math.min(99, Math.abs(value)).toString().padStart(2, '0')}` : Math.min(999, value).toString().padStart(3, '0');
const faceFor = (status: GameStatus, cellPressed: boolean) => cellPressed ? 'surprised' : status === 'won' ? 'cool' : status === 'lost' ? 'dead' : 'idle';

function Counter({ value, label }: { value: number; label: string }) {
  return <span className={styles.counter} aria-label={label} data-value={display(value)}>{[...display(value)].map((digit, index) => <SevenDigit key={`${digit}-${index}`} value={digit} />)}</span>;
}

const litSegments: Record<string, string> = { '0': 'ab cdef'.replace(' ', ''), '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g' };
const segmentPaths: Record<string, string> = {
  a: '3 1,15 1,13 4,5 4', b: '15 2,17 4,17 14,14 13,14 5', c: '14 18,17 17,17 28,15 30,14 27', d: '5 28,13 28,15 31,3 31', e: '1 17,4 18,4 27,2 30,1 28', f: '1 4,3 2,4 5,4 13,1 14', g: '4 14,14 14,16 16,14 18,4 18,2 16',
};
function SevenDigit({ value }: { value: string }) {
  const lit = litSegments[value] ?? '';
  return <svg className={styles.digit} viewBox="0 0 18 32" aria-hidden="true">{Object.entries(segmentPaths).map(([segment, points]) => <polygon key={segment} points={points} className={lit.includes(segment) ? styles.segmentOn : styles.segmentOff} />)}</svg>;
}

function Face({ state }: { state: ReturnType<typeof faceFor> }) {
  return <span className={`${styles.faceDrawing} ${styles[state]}`} aria-hidden="true"><i className={styles.leftEye} /><i className={styles.rightEye} /><b /></span>;
}

function CellMark({ cell }: { cell: Cell }) {
  if (cell.isIncorrectFlag) return <span className={styles.incorrectMark}><span className={styles.flag}><i /><b /></span><em /></span>;
  if (cell.isFlagged) return <span className={styles.flag}><i /><b /></span>;
  if (cell.isMine && cell.isRevealed) return <span className={styles.mine}><i /></span>;
  return <>{cell.isRevealed && cell.adjacent ? cell.adjacent : ''}</>;
}

export function Minesweeper({ onWin, random = Math.random }: { onWin: () => void; random?: RandomSource }) {
  const [game, setGame] = useState(() => createGame());
  const [seconds, setSeconds] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [cellPressed, setCellPressed] = useState(false);
  const wonReported = useRef(false);
  const longPressTimer = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const reset = () => {
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
    suppressClick.current = false;
    setGame(createGame()); setSeconds(0); setFlagMode(false); setCellPressed(false); wonReported.current = false;
  };
  useEffect(() => {
    if (game.status !== 'playing') return;
    const timer = window.setInterval(() => setSeconds((value) => Math.min(999, value + 1)), 1000);
    return () => window.clearInterval(timer);
  }, [game.status]);
  useEffect(() => () => { if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current); }, []);
  useEffect(() => { if (game.status === 'won' && !wonReported.current) { wonReported.current = true; onWin(); } }, [game.status, onWin]);

  const reveal = (cell: Cell) => setGame((current) => flagMode ? toggleFlag(current, cell.row, cell.col) : revealCell(current, cell.row, cell.col, random));
  const flag = (cell: Cell) => setGame((current) => toggleFlag(current, cell.row, cell.col));
  const chord = (cell: Cell) => setGame((current) => chordCell(current, cell.row, cell.col));
  const clickCell = (cell: Cell) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    reveal(cell);
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, cell: Cell) => {
    if (event.key.toLowerCase() === 'f') { event.preventDefault(); flag(cell); }
    if (event.key.toLowerCase() === 'c') { event.preventDefault(); chord(cell); }
  };
  const pointerDown = (event: PointerEvent<HTMLButtonElement>, cell: Cell) => {
    if (game.status === 'won' || game.status === 'lost') return;
    const chordGesture = event.pointerType === 'mouse' && (event.button === 1 || event.buttons === 3 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey);
    if (chordGesture) {
      event.preventDefault();
      suppressClick.current = true;
      chord(cell);
      return;
    }
    if (event.button === 0 && !cell.isRevealed && !cell.isFlagged) setCellPressed(true);
    if (event.pointerType === 'mouse') return;
    suppressClick.current = false;
    longPressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      setCellPressed(false);
      flag(cell);
      longPressTimer.current = null;
    }, 550);
  };
  const releasePointer = () => {
    setCellPressed(false);
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };
  const label = (cell: Cell) => cell.isIncorrectFlag ? `Row ${cell.row + 1}, column ${cell.col + 1}, incorrectly flagged` : cell.isFlagged ? `Row ${cell.row + 1}, column ${cell.col + 1}, flagged` : !cell.isRevealed ? `Row ${cell.row + 1}, column ${cell.col + 1}, hidden` : cell.isExploded ? `Row ${cell.row + 1}, column ${cell.col + 1}, exploded mine` : cell.isMine ? `Row ${cell.row + 1}, column ${cell.col + 1}, mine` : `Row ${cell.row + 1}, column ${cell.col + 1}, ${cell.adjacent ? `${cell.adjacent} adjacent mines` : 'empty'}`;
  const faceState = faceFor(game.status, cellPressed);

  return <section className={styles.game} aria-label="Minesweeper">
    <div className={styles.gameFrame}>
      <div className={styles.panel}>
        <Counter value={flagsRemaining(game)} label={`${flagsRemaining(game)} mines remaining`} />
        <button type="button" className={styles.faceButton} data-face={faceState} aria-label="Start a new game" onClick={reset}><Face state={faceState} /></button>
        <Counter value={seconds} label={`${seconds} seconds elapsed`} />
      </div>
      <div className={styles.touchTools}><button type="button" className={flagMode ? styles.enabled : ''} aria-pressed={flagMode} onClick={() => setFlagMode((value) => !value)}><span aria-hidden="true">⚑</span> Flag mode</button></div>
      <div className={styles.boardFrame}><div className={styles.board} role="grid" aria-label="9 by 9 Minesweeper board" style={{ '--columns': game.cols } as React.CSSProperties}>
        {game.cells.map((cell) => <button type="button" role="gridcell" key={`${cell.row}-${cell.col}`} className={`${styles.cell} ${cell.isRevealed ? styles.revealed : ''} ${cell.isExploded ? styles.exploded : ''} ${cell.isIncorrectFlag ? styles.incorrect : ''} ${cell.adjacent ? styles[`n${cell.adjacent}`] : ''}`} aria-label={label(cell)} aria-pressed={cell.isFlagged} onClick={() => clickCell(cell)} onAuxClick={(event) => { if (event.button === 1) event.preventDefault(); }} onContextMenu={(event) => { event.preventDefault(); if (event.buttons !== 3) flag(cell); }} onKeyDown={(event) => keyboard(event, cell)} onPointerDown={(event) => pointerDown(event, cell)} onPointerUp={releasePointer} onPointerCancel={releasePointer} onPointerLeave={releasePointer}>
          <span aria-hidden="true"><CellMark cell={cell} /></span>
        </button>)}
      </div></div>
    </div>
    <p className="sr-only">Reveal with Enter or Space. Press F to toggle a flag. Press C on an open number to chord. Mouse users can also chord with the middle button, both mouse buttons, or a modifier and click. Touch users can enable Flag mode or press and hold a cell.</p>
    <p className="sr-only" aria-live="assertive">{game.status === 'won' ? 'You won Minesweeper. Secret file unlocked.' : game.status === 'lost' ? 'Game over. You revealed a mine.' : ''}</p>
  </section>;
}
