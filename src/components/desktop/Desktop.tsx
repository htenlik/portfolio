import { useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { WindowId } from '../../types/windows';
import styles from './Desktop.module.css';

interface DesktopEntry { id: WindowId | 'github'; label: string; icon: string }
const entries: DesktopEntry[] = [
  { id: 'about', label: 'My Computer', icon: '/icons/computer.svg' },
  { id: 'experience', label: 'Work Experience', icon: '/icons/briefcase.svg' },
  { id: 'projects', label: 'My Projects', icon: '/icons/folder.svg' },
  { id: 'resume', label: 'Resume.pdf', icon: '/icons/document.svg' },
  { id: 'minesweeper', label: 'Minesweeper.exe', icon: '/icons/mine.svg' },
  { id: 'github', label: 'GitHub.url', icon: '/icons/globe.svg' },
  { id: 'contact', label: 'Contact', icon: '/icons/contact.svg' },
];

export function Desktop() {
  const [selected, setSelected] = useState<string | null>(null);
  const mobile = useMediaQuery('(max-width: 640px), (pointer: coarse)');
  const { openWindow } = useWindowManager();
  const open = (id: DesktopEntry['id']) => id === 'github' ? window.open('https://github.com/htenlik', '_blank', 'noopener,noreferrer') : openWindow(id);
  return (
    <div className={styles.desktop} onPointerDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <h1 className="sr-only">Hüseyin Tenlik — Software Engineer portfolio</h1>
      <div className={styles.grid} role="list" aria-label="Desktop shortcuts">
        {entries.map((entry) => (
          <button key={entry.id} type="button" role="listitem" className={`${styles.icon} ${selected === entry.id ? styles.selected : ''}`}
            onClick={() => { setSelected(entry.id); if (mobile) open(entry.id); }} onDoubleClick={() => !mobile && open(entry.id)}
            onKeyDown={(event) => { if (event.key === 'Enter') open(entry.id); }} aria-label={`${entry.label}, shortcut`}>
            <img src={entry.icon} alt="" draggable="false" /><span>{entry.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
