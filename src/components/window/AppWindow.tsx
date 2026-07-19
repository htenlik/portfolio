import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useViewportSize } from '../../hooks/useViewportSize';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { WindowInstance } from '../../types/windows';
import styles from './AppWindow.module.css';

export function AppWindow({ window, children }: { window: WindowInstance; children: ReactNode }) {
  const manager = useWindowManager();
  const mobile = useMediaQuery('(max-width: 640px)');
  const viewport = useViewportSize();
  const drag = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  if (!window.isOpen || window.isMinimized) return null;
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (mobile || window.isMaximized || (event.target as HTMLElement).closest('button')) return;
    drag.current = { pointerX: event.clientX, pointerY: event.clientY, x: window.position.x, y: window.position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const width = Math.min(window.size.width, innerWidth);
    const x = Math.max(-width + 90, Math.min(innerWidth - 90, drag.current.x + event.clientX - drag.current.pointerX));
    const y = Math.max(0, Math.min(innerHeight - 78, drag.current.y + event.clientY - drag.current.pointerY));
    manager.moveWindow(window.id, { x, y });
  };
  const stop = () => { drag.current = null; };
  const safeWidth = Math.min(window.size.width, viewport.width);
  const safeHeight = Math.min(window.size.height, viewport.height - 40);
  const style = mobile || window.isMaximized ? undefined : { left: Math.max(-safeWidth + 90, Math.min(viewport.width - 90, window.position.x)), top: Math.max(0, Math.min(viewport.height - 78, window.position.y)), width: safeWidth, height: safeHeight, zIndex: window.zIndex };
  return (
    <section className={`${styles.window} ${window.isMaximized ? styles.maximized : ''}`} style={style} onPointerDown={() => manager.focusWindow(window.id)} aria-label={window.title}>
      <div className={`${styles.titlebar} ${manager.state.activeId === window.id ? styles.active : ''}`} onDoubleClick={() => manager.toggleMaximize(window.id)} onPointerDown={startDrag} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}>
        <span><img src={window.icon} alt="" />{window.title}</span>
        <div className={styles.controls}>
          <button type="button" aria-label={`Minimize ${window.title}`} onClick={() => manager.minimizeWindow(window.id)}>_</button>
          <button type="button" aria-label={`${window.isMaximized ? 'Restore' : 'Maximize'} ${window.title}`} onClick={() => manager.toggleMaximize(window.id)}>{window.isMaximized ? '❐' : '□'}</button>
          <button type="button" aria-label={`Close ${window.title}`} onClick={() => manager.closeWindow(window.id)}>×</button>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.status}>Ready</div>
    </section>
  );
}
