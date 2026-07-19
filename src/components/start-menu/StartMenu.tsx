import { useEffect, useRef, useState } from 'react';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { WindowId } from '../../types/windows';
import styles from './StartMenu.module.css';

const items: { id: WindowId | 'github'; label: string; icon: string }[] = [
  { id: 'about', label: 'About', icon: '/icons/computer.svg' }, { id: 'experience', label: 'Work Experience', icon: '/icons/briefcase.svg' },
  { id: 'projects', label: 'Projects', icon: '/icons/folder.svg' }, { id: 'resume', label: 'Resume', icon: '/icons/document.svg' },
  { id: 'minesweeper', label: 'Minesweeper', icon: '/icons/mine.svg' }, { id: 'github', label: 'GitHub', icon: '/icons/globe.svg' },
  { id: 'contact', label: 'Contact', icon: '/icons/contact.svg' },
];

export function StartMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const menu = useRef<HTMLDivElement>(null);
  const [shutdown, setShutdown] = useState(false);
  const { openWindow } = useWindowManager();
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node) && !(event.target as HTMLElement).closest('[aria-controls="start-menu"]')) onClose(); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); };
  }, [onClose, open]);
  useEffect(() => { if (!shutdown) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setShutdown(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [shutdown]);
  if (!open && !shutdown) return null;
  return (
    <>
      {open && <div ref={menu} id="start-menu" className={styles.menu}>
        <header><img src="/icons/ht-mark.svg" alt="" /><span><strong>Hüseyin Tenlik</strong><small>Software Engineer</small></span></header>
        <nav aria-label="Start menu">{items.map((item) => <button key={item.id} type="button" onClick={() => { if (item.id === 'github') window.open('https://github.com/htenlik', '_blank', 'noopener,noreferrer'); else openWindow(item.id); onClose(); }}><img src={item.icon} alt="" /><span>{item.label}</span></button>)}</nav>
        <footer><button type="button" onClick={() => { setShutdown(true); onClose(); }}><span aria-hidden="true">⏻</span> Shut Down</button></footer>
      </div>}
      {shutdown && <div className={styles.overlay} role="presentation" onPointerDown={(e) => { if (e.target === e.currentTarget) setShutdown(false); }}><section role="dialog" aria-modal="true" aria-labelledby="shutdown-title" className={styles.dialog}><h2 id="shutdown-title">Shut Down htenlikOS</h2><p>You can close this tab, but htenlikOS will be here when you return.</p><button className="retro-button" type="button" autoFocus onClick={() => setShutdown(false)}>Return to desktop</button></section></div>}
    </>
  );
}
