import { useLayoutEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useViewportSize } from '../../hooks/useViewportSize';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { ResizeDirection, WindowInstance } from '../../types/windows';
import styles from './AppWindow.module.css';

export function AppWindow({ window, children }: { window: WindowInstance; children: ReactNode }) {
  const manager = useWindowManager();
  const mobile = useMediaQuery('(max-width: 640px)');
  const viewport = useViewportSize();
  const drag = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const resize = useRef<{ pointerX: number; pointerY: number; width: number; height: number; direction: ResizeDirection } | null>(null);
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!window.isOpen || !content.current) return;
    if (typeof content.current.scrollTo === 'function') content.current.scrollTo({ top: 0, left: 0 });
    else { content.current.scrollTop = 0; content.current.scrollLeft = 0; }
  }, [window.isOpen]);
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
  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    if (mobile || window.isMaximized) return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.currentTarget.dataset.direction as ResizeDirection;
    resize.current = { pointerX: event.clientX, pointerY: event.clientY, width: window.size.width, height: window.size.height, direction };
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.userSelect = 'none';
    manager.focusWindow(window.id);
  };
  const resizeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!resize.current) return;
    const horizontal = resize.current.direction !== 'bottom';
    const vertical = resize.current.direction !== 'right';
    manager.resizeWindow(window.id, {
      width: horizontal ? resize.current.width + event.clientX - resize.current.pointerX : window.size.width,
      height: vertical ? resize.current.height + event.clientY - resize.current.pointerY : window.size.height,
    }, { width: viewport.width, height: viewport.height, taskbarHeight: 36 });
  };
  const stopResize = () => { resize.current = null; document.body.style.userSelect = ''; };
  const safeWidth = Math.min(window.size.width, viewport.width);
  const safeHeight = Math.min(window.size.height, viewport.height - 40);
  const style = mobile || window.isMaximized ? undefined : { left: Math.max(-safeWidth + 90, Math.min(viewport.width - 90, window.position.x)), top: Math.max(0, Math.min(viewport.height - 78, window.position.y)), width: safeWidth, height: safeHeight, zIndex: window.zIndex };
  return (
    <section className={`${styles.window} ${window.isMaximized ? styles.maximized : ''} ${manager.state.activeId === window.id ? styles.activeWindow : ''}`} style={style} onPointerDown={() => manager.focusWindow(window.id)} aria-label={window.title}>
      <div className={`${styles.titlebar} ${manager.state.activeId === window.id ? styles.active : ''}`} onDoubleClick={() => manager.toggleMaximize(window.id)} onPointerDown={startDrag} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}>
        <span><img src={window.icon} alt="" />{window.title}</span>
        <div className={styles.controls}>
          <button type="button" className={styles.minimize} aria-label={`Minimize ${window.title}`} onClick={() => manager.minimizeWindow(window.id)}><span /></button>
          <button type="button" className={window.isMaximized ? styles.restore : styles.maximize} aria-label={`${window.isMaximized ? 'Restore' : 'Maximize'} ${window.title}`} onClick={() => manager.toggleMaximize(window.id)}><span /></button>
          <button type="button" className={styles.close} aria-label={`Close ${window.title}`} onClick={() => manager.closeWindow(window.id)}><span /></button>
        </div>
      </div>
      <div ref={content} className={styles.content} data-window-content={window.id}>{children}</div>
      <div className={styles.status}><span>Ready</span><i aria-hidden="true" /></div>
      {!mobile && !window.isMaximized && <>
        <div className={`${styles.resizeHandle} ${styles.resizeRight}`} data-direction="right" aria-hidden="true" onPointerDown={startResize} onPointerMove={resizeMove} onPointerUp={stopResize} onPointerCancel={stopResize} />
        <div className={`${styles.resizeHandle} ${styles.resizeBottom}`} data-direction="bottom" aria-hidden="true" onPointerDown={startResize} onPointerMove={resizeMove} onPointerUp={stopResize} onPointerCancel={stopResize} />
        <div className={`${styles.resizeHandle} ${styles.resizeCorner}`} data-direction="bottom-right" aria-label={`Resize ${window.title}`} role="separator" aria-orientation="vertical" onPointerDown={startResize} onPointerMove={resizeMove} onPointerUp={stopResize} onPointerCancel={stopResize} />
      </>}
    </section>
  );
}
