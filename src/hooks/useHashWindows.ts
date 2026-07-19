import { useEffect } from 'react';
import { isWindowId } from '../state/window-manager/registry';
import { useWindowManager } from '../state/window-manager/WindowManagerContext';

export function useHashWindows() {
  const { openWindow } = useWindowManager();
  useEffect(() => {
    const sync = () => {
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (isWindowId(target)) openWindow(target, false);
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, [openWindow]);
}
