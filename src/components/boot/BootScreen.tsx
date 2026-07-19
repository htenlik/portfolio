import { useEffect, useState } from 'react';
import styles from './BootScreen.module.css';

export function BootScreen() {
  const [visible, setVisible] = useState(() => {
    try { return sessionStorage.getItem('htenlikos-booted') !== 'true' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch { return false; }
  });
  useEffect(() => {
    if (!visible) return;
    const finish = () => { try { sessionStorage.setItem('htenlikos-booted', 'true'); } catch { /* optional storage */ } setVisible(false); };
    const key = (event: KeyboardEvent) => { if (['Enter', ' ', 'Escape'].includes(event.key)) finish(); };
    const timer = window.setTimeout(finish, 1050);
    window.addEventListener('keydown', key);
    return () => { window.clearTimeout(timer); window.removeEventListener('keydown', key); };
  }, [visible]);
  if (!visible) return null;
  return (
    <button className={styles.boot} type="button" onClick={() => { try { sessionStorage.setItem('htenlikos-booted', 'true'); } catch { /* optional storage */ } setVisible(false); }} aria-label="Skip htenlikOS startup">
      <img src="/icons/ht-mark.svg" alt="" />
      <strong>htenlikOS</strong><span>Personal Engineering Portfolio</span>
      <i aria-hidden="true"><b /></i><small>Click or press a key to skip</small>
    </button>
  );
}
