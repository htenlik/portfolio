import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Point, ResizeViewport, Size, WindowId } from '../../types/windows';
import { initialWindowState, windowReducer } from './reducer';

interface WindowManagerValue {
  state: typeof initialWindowState;
  openWindow: (id: WindowId, updateHash?: boolean) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: Point) => void;
  resizeWindow: (id: WindowId, size: Size, viewport: ResizeViewport) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);
  const openWindow = useCallback((id: WindowId, updateHash = true) => {
    dispatch({ type: 'OPEN', id });
    if (updateHash && window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
  }, []);
  const closeWindow = useCallback((id: WindowId) => {
    dispatch({ type: 'CLOSE', id });
    if (window.location.hash === `#${id}`) window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
  }, []);
  const value = useMemo<WindowManagerValue>(() => ({
    state, openWindow,
    focusWindow: (id) => dispatch({ type: 'FOCUS', id }),
    moveWindow: (id, position) => dispatch({ type: 'MOVE', id, position }),
    resizeWindow: (id, size, viewport) => dispatch({ type: 'RESIZE', id, size, viewport }),
    minimizeWindow: (id) => dispatch({ type: 'MINIMIZE', id }),
    restoreWindow: (id) => dispatch({ type: 'RESTORE', id }),
    toggleMaximize: (id) => dispatch({ type: 'TOGGLE_MAXIMIZE', id }),
    closeWindow,
  }), [closeWindow, openWindow, state]);
  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

// Context and its hook intentionally live together to keep the provider API cohesive.
// eslint-disable-next-line react-refresh/only-export-components
export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error('useWindowManager must be used inside WindowManagerProvider');
  return context;
}
