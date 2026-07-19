import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { chordCell, createGame, cycleMark, difficulties, flagsRemaining, revealCell, type Cell, type Difficulty, type GameStatus, type RandomSource } from './engine';
import { mineAssets } from './referenceAssets';
import styles from './Minesweeper.module.css';

type MenuName = 'Game' | 'Help';
type ThemeName = 'xp' | '98' | '31';
type PressMode = 'single' | 'chord' | null;

const dimensions = (difficulty: Difficulty) => difficulties[difficulty];
const faceAsset = (status: GameStatus, pressed: boolean) => pressed ? mineAssets.surprised : status === 'won' ? mineAssets.win : status === 'lost' ? mineAssets.dead : mineAssets.smile;
const display = (value: number) => value < 0 ? `-${String(Math.abs(value) % 100).padStart(2, '0')}` : String(Math.min(999, value)).padStart(3, '0');

function Counter({ value, label }: { value: number; label: string }) {
  return <span className={styles.counter} aria-label={label} data-value={display(value)}>{[...display(value)].map((digit, index) => <img key={`${digit}-${index}`} src={digit === '-' ? mineAssets.digitMinus : mineAssets.digits[Number(digit)]} alt="" />)}</span>;
}

function CellSprite({ cell, pressed }: { cell: Cell; pressed: boolean }) {
  if (cell.isIncorrectFlag) return <img src={mineAssets.misflagged} alt="" />;
  if (cell.isFlagged) return <><span className={pressed ? styles.openCell : styles.coveredCell} /><img src={mineAssets.flag} alt="" /></>;
  if (cell.isQuestion) return <><span className={pressed ? styles.openCell : styles.coveredCell} /><img src={mineAssets.question} alt="" /></>;
  if (cell.isExploded) return <img src={mineAssets.mineDeath} alt="" />;
  if (cell.isMine && cell.isRevealed) return <img src={mineAssets.mine} alt="" />;
  if (cell.isRevealed) return <><span className={styles.openCell} />{cell.adjacent > 0 && <img src={mineAssets.numbers[cell.adjacent]} alt="" />}</>;
  return <span className={pressed ? styles.openCell : styles.coveredCell} />;
}

function MenuRow({ children, checked, hotkey, onSelect, disabled = false }: { children: string; checked?: boolean; hotkey?: string; onSelect?: () => void; disabled?: boolean }) {
  return <button type="button" role="menuitem" disabled={disabled} className={styles.menuRow} onClick={onSelect}><span className={styles.menuCheck}>{checked && <img src={mineAssets.checked} alt="" />}</span><span>{children}</span><span className={styles.hotkey}>{hotkey}</span></button>;
}

function Separator() { return <span className={styles.menuSeparator} role="separator" />; }

export function Minesweeper({ onWin, random = Math.random, initialDifficulty = 'Beginner', onBoardSizeChange, onExit }: { onWin: () => void; random?: RandomSource; initialDifficulty?: Difficulty; onBoardSizeChange?: (difficulty: Difficulty, scale: number) => void; onExit?: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [game, setGame] = useState(() => { const config = dimensions(initialDifficulty); return createGame(config.rows, config.cols, config.mines); });
  const [seconds, setSeconds] = useState(0);
  const [marks, setMarks] = useState(true);
  const [theme, setTheme] = useState<ThemeName>('xp');
  const [scale, setScale] = useState(1);
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const [dialog, setDialog] = useState<'help' | 'about' | null>(null);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [pressMode, setPressMode] = useState<PressMode>(null);
  const [facePressed, setFacePressed] = useState(false);
  const wonReported = useRef(false);
  const longPressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  const reset = useCallback((nextDifficulty = difficulty) => {
    const config = dimensions(nextDifficulty);
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    setDifficulty(nextDifficulty); setGame(createGame(config.rows, config.cols, config.mines)); setSeconds(0); setOpenMenu(null); setPressedIndex(null); setPressMode(null); setFacePressed(false); wonReported.current = false; longPressed.current = false;
  }, [difficulty]);

  useEffect(() => { onBoardSizeChange?.(difficulty, scale); }, [difficulty, onBoardSizeChange, scale]);
  useEffect(() => {
    if (game.status !== 'playing') return;
    const timer = window.setInterval(() => setSeconds((value) => Math.min(999, value + 1)), 1000);
    return () => window.clearInterval(timer);
  }, [game.status]);
  useEffect(() => { if (game.status === 'won' && !wonReported.current) { wonReported.current = true; onWin(); } }, [game.status, onWin]);
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'F2') { event.preventDefault(); reset(); }
      if (event.key === 'F1') { event.preventDefault(); setOpenMenu('Help'); }
      if (event.key === 'Escape') { setOpenMenu(null); setDialog(null); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [reset]);
  useEffect(() => () => { if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current); }, []);

  const nearIndexes = useCallback((index: number) => {
    const cell = game.cells[index]; if (!cell) return [];
    return game.cells.map((candidate, candidateIndex) => Math.abs(candidate.row - cell.row) <= 1 && Math.abs(candidate.col - cell.col) <= 1 ? candidateIndex : -1).filter((candidateIndex) => candidateIndex >= 0);
  }, [game.cells]);
  const pressed = useMemo(() => {
    if (pressedIndex === null) return new Set<number>();
    return new Set(pressMode === 'chord' ? nearIndexes(pressedIndex) : [pressedIndex]);
  }, [nearIndexes, pressMode, pressedIndex]);

  const reveal = (cell: Cell) => setGame((current) => revealCell(current, cell.row, cell.col, random));
  const chord = (cell: Cell) => setGame((current) => chordCell(current, cell.row, cell.col));
  const mark = (cell: Cell) => setGame((current) => cycleMark(current, cell.row, cell.col, marks));
  const finishPress = (cell: Cell) => {
    if (longPressed.current) { longPressed.current = false; return; }
    if (pressMode === 'chord' || cell.isRevealed) chord(cell); else reveal(cell);
    setPressedIndex(null); setPressMode(null); setFacePressed(false);
  };
  const pointerDown = (event: PointerEvent<HTMLButtonElement>, cell: Cell, index: number) => {
    if (game.status === 'won' || game.status === 'lost') return;
    if (event.button === 2) { event.preventDefault(); mark(cell); return; }
    const chordGesture = event.button === 1 || event.buttons === 3 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey || cell.isRevealed;
    setPressedIndex(index); setPressMode(chordGesture ? 'chord' : 'single'); setFacePressed(true);
    if (event.pointerType !== 'mouse') {
      longPressed.current = false;
      longPressTimer.current = window.setTimeout(() => { longPressed.current = true; mark(cell); setPressedIndex(null); setFacePressed(false); }, 500);
    }
  };
  const pointerUp = (cell: Cell) => {
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
    if (pressedIndex !== null) finishPress(cell);
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, cell: Cell) => {
    if (event.key.toLowerCase() === 'f') { event.preventDefault(); mark(cell); }
    if (event.key.toLowerCase() === 'c') { event.preventDefault(); chord(cell); }
  };
  const label = (cell: Cell) => cell.isIncorrectFlag ? `Row ${cell.row + 1}, column ${cell.col + 1}, incorrectly flagged` : cell.isFlagged ? `Row ${cell.row + 1}, column ${cell.col + 1}, flagged` : cell.isQuestion ? `Row ${cell.row + 1}, column ${cell.col + 1}, question mark` : !cell.isRevealed ? `Row ${cell.row + 1}, column ${cell.col + 1}, hidden` : cell.isExploded ? `Row ${cell.row + 1}, column ${cell.col + 1}, exploded mine` : cell.isMine ? `Row ${cell.row + 1}, column ${cell.col + 1}, mine` : `Row ${cell.row + 1}, column ${cell.col + 1}, ${cell.adjacent ? `${cell.adjacent} adjacent mines` : 'empty'}`;
  const chooseDifficulty = (value: Difficulty) => reset(value);
  const style = { '--columns': game.cols, '--mine-scale': scale } as CSSProperties;
  const themeClass = theme === 'xp' ? styles.themeXp : theme === '98' ? styles.theme98 : styles.theme31;

  return <section className={`${styles.game} ${themeClass}`} aria-label="Minesweeper" onContextMenu={(event) => event.preventDefault()}>
    <div className={styles.scaler} style={style}>
      <div className={styles.menuBar}>{(['Game', 'Help'] as const).map((menu) => <span className={styles.menuSlot} key={menu}><button type="button" aria-haspopup="menu" aria-expanded={openMenu === menu} onPointerDown={() => setOpenMenu(menu)} onPointerEnter={() => { if (openMenu) setOpenMenu(menu); }}>{menu}</button>{openMenu === menu && <span className={styles.dropDown} role="menu">{menu === 'Game' ? <>
        <MenuRow hotkey="F2" onSelect={() => reset()}>New</MenuRow><Separator />
        {(['Beginner', 'Intermediate', 'Expert'] as const).map((value) => <MenuRow key={value} checked={difficulty === value} onSelect={() => chooseDifficulty(value)}>{value}</MenuRow>)}
        <MenuRow disabled>Custom...</MenuRow><Separator />
        <MenuRow checked={marks} onSelect={() => { setMarks((value) => !value); setOpenMenu(null); }}>Marks (?)</MenuRow>
        <MenuRow checked>Color</MenuRow><MenuRow disabled>Sound</MenuRow><Separator />
        <MenuRow disabled>Best Times...</MenuRow><Separator /><MenuRow onSelect={() => onExit?.()}>Exit</MenuRow>
      </> : <>
        <MenuRow hotkey="F1" onSelect={() => { setDialog('help'); setOpenMenu(null); }}>Contents</MenuRow>
        <MenuRow onSelect={() => { setDialog('help'); setOpenMenu(null); }}>Search for Help on...</MenuRow>
        <MenuRow onSelect={() => { setDialog('help'); setOpenMenu(null); }}>Using Help</MenuRow><Separator />
        <MenuRow onSelect={() => { setDialog('about'); setOpenMenu(null); }}>About Minesweeper...</MenuRow><Separator />
        <MenuRow checked={theme === 'xp'} onSelect={() => { setTheme('xp'); setOpenMenu(null); }}>Windows XP Style</MenuRow>
        <MenuRow checked={theme === '98'} onSelect={() => { setTheme('98'); setOpenMenu(null); }}>Windows 98 Style</MenuRow>
        <MenuRow checked={theme === '31'} onSelect={() => { setTheme('31'); setOpenMenu(null); }}>Windows 3.1 Style</MenuRow><Separator />
        <MenuRow checked={scale === 1.5} onSelect={() => { setScale(scale === 1.5 ? 1 : 1.5); setOpenMenu(null); }}>1.5x Scale</MenuRow>
        <MenuRow checked={scale === 2} onSelect={() => { setScale(scale === 2 ? 1 : 2); setOpenMenu(null); }}>2x Scale</MenuRow>
      </>}</span>}</span>)}</div>
      <div className={styles.content}>
        <div className={styles.scoreBar}>
          <Counter value={flagsRemaining(game)} label={`${flagsRemaining(game)} mines remaining`} />
          <span className={styles.faceOuter}><button type="button" className={styles.face} data-face={facePressed ? 'surprised' : game.status} aria-label="Start a new game" onClick={() => reset()}><img src={faceAsset(game.status, facePressed)} alt="" /></button></span>
          <Counter value={seconds} label={`${seconds} seconds elapsed`} />
        </div>
        <div className={styles.board} role="grid" aria-label={`${game.rows} by ${game.cols} Minesweeper board`}>
          {game.cells.map((cell, index) => <button type="button" role="gridcell" key={`${cell.row}-${cell.col}`} className={styles.cell} aria-label={label(cell)} aria-pressed={cell.isFlagged} onPointerDown={(event) => pointerDown(event, cell, index)} onPointerEnter={() => { if (pressMode) setPressedIndex(index); }} onPointerUp={() => pointerUp(cell)} onPointerCancel={() => { setPressedIndex(null); setFacePressed(false); }} onContextMenu={(event) => event.preventDefault()} onKeyDown={(event) => keyboard(event, cell)}><CellSprite cell={cell} pressed={pressed.has(index) && !cell.isFlagged} /></button>)}
        </div>
      </div>
    </div>
    {dialog && <div className={styles.dialogOverlay}><section role="dialog" aria-modal="true" aria-label={dialog === 'about' ? 'About Minesweeper' : 'Minesweeper Help'} className={styles.dialog}><h2>{dialog === 'about' ? 'Minesweeper' : 'Minesweeper Help'}</h2>{dialog === 'about' ? <p>Clear the minefield without opening a mine.</p> : <p>Left click opens a square. Right click marks it. Press both mouse buttons on an open number to clear its neighbours when the flags match.</p>}<button type="button" autoFocus onClick={() => setDialog(null)}>OK</button></section></div>}
    <p className="sr-only" aria-live="assertive">{game.status === 'won' ? 'You won Minesweeper. Secret file unlocked.' : game.status === 'lost' ? 'Game over. You revealed a mine.' : ''}</p>
  </section>;
}
