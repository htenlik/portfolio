import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { contact } from '../../content/contact';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { WindowId } from '../../types/windows';
import styles from './Desktop.module.css';

interface DesktopEntry { id: WindowId | 'github' | 'linkedin'; label: string; icon: string }
interface Point { x: number; y: number }
interface ContextMenuState { kind: 'desktop' | 'shortcut'; x: number; y: number; entry?: DesktopEntry }

const STORAGE_KEY = 'htenlikos-desktop-layout-v1';
const GRID_X = 89;
const GRID_Y = 84;
const ORIGIN_X = 8;
const ORIGIN_Y = 10;

const entries: DesktopEntry[] = [
  { id: 'about', label: 'My Computer', icon: '/icons/computer.svg' },
  { id: 'experience', label: 'Experiences', icon: '/icons/briefcase.svg' },
  { id: 'projects', label: 'My Projects', icon: '/icons/folder.svg' },
  { id: 'resume', label: 'Resume.pdf', icon: '/icons/document.svg' },
  { id: 'github', label: 'GitHub.url', icon: '/icons/github.svg' },
  { id: 'linkedin', label: 'LinkedIn.url', icon: '/icons/linkedin.svg' },
  { id: 'minesweeper', label: 'Minesweeper.exe', icon: '/icons/mine.svg' },
  { id: 'contact', label: 'Contact', icon: '/icons/contact.svg' },
];

function defaultPosition(index: number): Point {
  return { x: ORIGIN_X + Math.floor(index / 6) * GRID_X, y: ORIGIN_Y + (index % 6) * GRID_Y };
}

function readPositions(): Record<string, Point> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, Point>;
    return Object.fromEntries(Object.entries(parsed).filter(([, point]) => Number.isFinite(point?.x) && Number.isFinite(point?.y)));
  } catch {
    return {};
  }
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function Desktop({ secretVisible = false }: { secretVisible?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Point>>(readPositions);
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const [properties, setProperties] = useState<DesktopEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const mobile = useMediaQuery('(max-width: 640px), (pointer: coarse)');
  const { openWindow } = useWindowManager();
  const desktopRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<number | undefined>(undefined);
  const refreshTimer = useRef<number | undefined>(undefined);
  const mobilePress = useRef<{ id: string; point: Point } | null>(null);
  const suppressOpen = useRef<string | null>(null);
  const drag = useRef<{ id: string; origin: Point; latest: Point; pointer: Point; moved: boolean } | null>(null);
  const allEntries = useMemo(() => [
    ...entries,
    ...(secretVisible ? [{ id: 'secret' as const, label: 'secret.txt', icon: '/icons/secret.svg' }] : []),
  ], [secretVisible]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(positions)); } catch { /* Storage can be unavailable. */ }
  }, [positions]);

  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(null); };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setMenu(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('pointerdown', closeOutside);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('pointerdown', closeOutside);
    };
  }, [menu]);

  useEffect(() => () => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
  }, []);

  const open = (id: DesktopEntry['id']) => id === 'github'
    ? window.open('https://github.com/htenlik', '_blank', 'noopener,noreferrer')
    : id === 'linkedin'
      ? contact.linkedin && window.open(contact.linkedin, '_blank', 'noopener,noreferrer')
      : openWindow(id);

  const positionFor = (entry: DesktopEntry, index: number) => positions[entry.id] ?? defaultPosition(index);
  const bounds = () => ({
    width: desktopRef.current?.clientWidth || window.innerWidth,
    height: desktopRef.current?.clientHeight || Math.max(320, window.innerHeight - 32),
  });
  const constrain = (point: Point): Point => {
    const { width, height } = bounds();
    return { x: clamp(point.x, 0, width - 84), y: clamp(point.y, 0, height - 78) };
  };
  const snap = (point: Point): Point => constrain({
    x: ORIGIN_X + Math.round((point.x - ORIGIN_X) / GRID_X) * GRID_X,
    y: ORIGIN_Y + Math.round((point.y - ORIGIN_Y) / GRID_Y) * GRID_Y,
  });
  const place = (id: string, point: Point) => setPositions((current) => ({ ...current, [id]: point }));
  const menuPosition = (x: number, y: number, height = 190) => ({
    x: clamp(x, 2, window.innerWidth - 205),
    y: clamp(y, 2, window.innerHeight - height - 34),
  });

  const startPointer = (event: ReactPointerEvent<HTMLButtonElement>, entry: DesktopEntry, index: number) => {
    if (event.button !== 0) return;
    setSelected(entry.id);
    setMenu(null);
    if (mobile) {
      const point = menuPosition(event.clientX, event.clientY, 210);
      mobilePress.current = { id: entry.id, point: { x: event.clientX, y: event.clientY } };
      longPressTimer.current = window.setTimeout(() => {
        suppressOpen.current = entry.id;
        setMenu({ kind: 'shortcut', entry, ...point });
      }, 550);
      return;
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const origin = positionFor(entry, index);
    drag.current = { id: entry.id, origin, latest: origin, pointer: { x: event.clientX, y: event.clientY }, moved: false };
  };

  const movePointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const touch = mobilePress.current;
    if (touch && touch.id === event.currentTarget.dataset.shortcutId
      && Math.hypot(event.clientX - touch.point.x, event.clientY - touch.point.y) > 8) {
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      mobilePress.current = null;
    }
    const current = drag.current;
    if (!current || current.id !== event.currentTarget.dataset.shortcutId) return;
    const dx = event.clientX - current.pointer.x;
    const dy = event.clientY - current.pointer.y;
    if (!current.moved && Math.hypot(dx, dy) < 4) return;
    current.moved = true;
    current.latest = constrain({ x: current.origin.x + dx, y: current.origin.y + dy });
    place(current.id, current.latest);
  };

  const endPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    mobilePress.current = null;
    const current = drag.current;
    if (!current || current.id !== event.currentTarget.dataset.shortcutId) return;
    if (current.moved) {
      place(current.id, snap(current.latest));
      suppressOpen.current = current.id;
    }
    drag.current = null;
  };

  const arrangeIcons = () => {
    setPositions(Object.fromEntries(allEntries.map((entry, index) => [entry.id, defaultPosition(index)])));
    setMenu(null);
  };

  const refreshDesktop = () => {
    setMenu(null);
    setSelected(null);
    setRefreshing(false);
    window.requestAnimationFrame(() => {
      setRefreshing(true);
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(() => setRefreshing(false), 180);
    });
  };

  return (
    <div ref={desktopRef} className={styles.desktop}>
      <h1 className="sr-only">Hüseyin Tenlik — Software Engineer portfolio</h1>
      <div className={`${styles.grid} ${refreshing ? styles.refreshing : ''}`} role="list" aria-label="Desktop shortcuts" aria-busy={refreshing}
        onPointerDown={(event) => { if (event.target === event.currentTarget) { setSelected(null); setMenu(null); } }}
        onContextMenu={(event) => { if (event.target !== event.currentTarget) return; event.preventDefault(); setSelected(null); setMenu({ kind: 'desktop', ...menuPosition(event.clientX, event.clientY) }); }}>
        {allEntries.map((entry, index) => (
          <div key={entry.id} role="listitem" className={styles.shortcut}
            style={{ left: positionFor(entry, index).x, top: positionFor(entry, index).y }}>
            <button type="button" data-shortcut-id={entry.id}
              className={`${styles.icon} ${selected === entry.id ? styles.selected : ''}`}
              aria-selected={selected === entry.id} aria-label={`${entry.label}, shortcut`}
              onPointerDown={(event) => startPointer(event, entry, index)} onPointerMove={movePointer}
              onPointerUp={endPointer} onPointerCancel={endPointer}
              onClick={() => {
                if (suppressOpen.current === entry.id) { suppressOpen.current = null; return; }
                setSelected(entry.id);
                if (mobile) open(entry.id);
              }}
              onDoubleClick={() => { if (!mobile && suppressOpen.current !== entry.id) open(entry.id); }}
              onContextMenu={(event) => {
                event.preventDefault(); event.stopPropagation(); setSelected(entry.id);
                setMenu({ kind: 'shortcut', entry, ...menuPosition(event.clientX, event.clientY, 210) });
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') open(entry.id);
                if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
                  event.preventDefault();
                  const rect = event.currentTarget.getBoundingClientRect();
                  setMenu({ kind: 'shortcut', entry, ...menuPosition(rect.left + 20, rect.top + 20, 210) });
                }
              }}>
              <img src={entry.icon} alt="" draggable="false" /><span>{entry.label}</span>
            </button>
          </div>
        ))}
      </div>

      {menu && (
        <div ref={menuRef} className={styles.contextMenu} role="menu" aria-label={menu.kind === 'desktop' ? 'Desktop context menu' : `${menu.entry?.label} context menu`}
          style={{ left: menu.x, top: menu.y }} onPointerDown={(event) => event.stopPropagation()}>
          {menu.kind === 'shortcut' && menu.entry ? <>
            <button type="button" role="menuitem" className={styles.defaultItem} onClick={() => { open(menu.entry!.id); setMenu(null); }}>Open</button>
            <div className={styles.separator} role="separator" />
            <button type="button" role="menuitem" disabled>Cut</button>
            <button type="button" role="menuitem" disabled>Copy</button>
            <button type="button" role="menuitem" disabled>Create Shortcut</button>
            <button type="button" role="menuitem" disabled>Delete</button>
            <button type="button" role="menuitem" disabled>Rename</button>
            <div className={styles.separator} role="separator" />
            <button type="button" role="menuitem" onClick={() => { setProperties(menu.entry!); setMenu(null); }}>Properties</button>
          </> : <>
            <button type="button" role="menuitem" onClick={arrangeIcons}>Arrange Icons By <span className={styles.menuArrow}>▶</span></button>
            <button type="button" role="menuitem" onClick={refreshDesktop}>Refresh</button>
            <div className={styles.separator} role="separator" />
            <button type="button" role="menuitem" disabled>Paste</button>
            <button type="button" role="menuitem" disabled>Paste Shortcut</button>
            <div className={styles.separator} role="separator" />
            <button type="button" role="menuitem" disabled>New <span className={styles.menuArrow}>▶</span></button>
            <div className={styles.separator} role="separator" />
            <button type="button" role="menuitem" onClick={() => { openWindow('about'); setMenu(null); }}>Properties</button>
          </>}
        </div>
      )}

      {properties && (
        <div className={styles.properties} role="dialog" aria-modal="true" aria-labelledby="shortcut-properties-title">
          <div className={styles.propertiesTitle} id="shortcut-properties-title">{properties.label} Properties</div>
          <div className={styles.propertiesBody}>
            <img src={properties.icon} alt="" />
            <div><strong>{properties.label}</strong><p>Type: {properties.id === 'github' || properties.id === 'linkedin' ? 'Internet Shortcut' : 'Application Shortcut'}</p><p>Location: htenlikOS Desktop</p></div>
          </div>
          <div className={styles.propertiesActions}><button type="button" autoFocus onClick={() => setProperties(null)}>OK</button></div>
        </div>
      )}
    </div>
  );
}
