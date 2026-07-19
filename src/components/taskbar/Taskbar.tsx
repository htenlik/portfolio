import { useEffect, useState } from 'react';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import { StartMenu } from '../start-menu/StartMenu';
import styles from './Taskbar.module.css';

export function Taskbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const { state, focusWindow, restoreWindow, minimizeWindow } = useWindowManager();
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const windows = Object.values(state.windows).filter((item) => item.isOpen);
  return (
    <>
      <StartMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <footer className={styles.taskbar}>
        <button type="button" className={`${styles.start} ${menuOpen ? styles.pressed : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="start-menu">
          <img src="/icons/ht-mark.svg" alt="" /><strong>start</strong>
        </button>
        <div className={styles.tasks} aria-label="Open windows">
          {windows.map((item) => <button key={item.id} type="button" className={state.activeId === item.id && !item.isMinimized ? styles.activeTask : ''} onClick={() => { if (item.isMinimized) restoreWindow(item.id); else if (state.activeId === item.id) minimizeWindow(item.id); else focusWindow(item.id); }}><img src={item.icon} alt="" /><span>{item.title}</span></button>)}
        </div>
        <time className={styles.tray} dateTime={now.toISOString()} title={now.toLocaleDateString(undefined, { dateStyle: 'full' })}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
      </footer>
    </>
  );
}
