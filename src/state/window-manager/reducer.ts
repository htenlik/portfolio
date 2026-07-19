import { windowRegistry } from './registry';
import type { Point, WindowId, WindowInstance } from '../../types/windows';

export interface WindowManagerState {
  windows: Partial<Record<WindowId, WindowInstance>>;
  activeId: WindowId | null;
  topZ: number;
}

export type WindowAction =
  | { type: 'OPEN'; id: WindowId }
  | { type: 'FOCUS'; id: WindowId }
  | { type: 'MOVE'; id: WindowId; position: Point }
  | { type: 'MINIMIZE'; id: WindowId }
  | { type: 'RESTORE'; id: WindowId }
  | { type: 'TOGGLE_MAXIMIZE'; id: WindowId }
  | { type: 'CLOSE'; id: WindowId };

export const initialWindowState: WindowManagerState = { windows: {}, activeId: null, topZ: 10 };

function focus(state: WindowManagerState, id: WindowId): WindowManagerState {
  const target = state.windows[id];
  if (!target?.isOpen) return state;
  const zIndex = state.topZ + 1;
  return { ...state, activeId: id, topZ: zIndex, windows: { ...state.windows, [id]: { ...target, zIndex, isMinimized: false } } };
}

function nextActive(windows: WindowManagerState['windows'], except: WindowId): WindowId | null {
  const candidates = Object.values(windows).filter((item) => item.isOpen && !item.isMinimized && item.id !== except);
  return candidates.sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;
}

export function windowReducer(state: WindowManagerState, action: WindowAction): WindowManagerState {
  const existing = state.windows[action.id];
  switch (action.type) {
    case 'OPEN': {
      if (existing?.isOpen) return focus(state, action.id);
      const source = existing ?? windowRegistry[action.id];
      const zIndex = state.topZ + 1;
      return {
        ...state, activeId: action.id, topZ: zIndex,
        windows: { ...state.windows, [action.id]: { ...source, position: existing?.position ?? source.defaultPosition, size: existing?.size ?? source.defaultSize, zIndex, isOpen: true, isMinimized: false, isMaximized: existing?.isMaximized ?? false } },
      };
    }
    case 'FOCUS': return focus(state, action.id);
    case 'MOVE':
      if (!existing?.isOpen || existing.isMaximized) return state;
      return { ...state, windows: { ...state.windows, [action.id]: { ...existing, position: action.position } } };
    case 'MINIMIZE':
      if (!existing?.isOpen) return state;
      return { ...state, activeId: state.activeId === action.id ? nextActive(state.windows, action.id) : state.activeId, windows: { ...state.windows, [action.id]: { ...existing, isMinimized: true } } };
    case 'RESTORE':
      if (!existing?.isOpen) return state;
      return focus({ ...state, windows: { ...state.windows, [action.id]: { ...existing, isMinimized: false } } }, action.id);
    case 'TOGGLE_MAXIMIZE':
      if (!existing?.isOpen) return state;
      return focus({ ...state, windows: { ...state.windows, [action.id]: { ...existing, isMaximized: !existing.isMaximized, isMinimized: false } } }, action.id);
    case 'CLOSE':
      if (!existing?.isOpen) return state;
      return { ...state, activeId: state.activeId === action.id ? nextActive(state.windows, action.id) : state.activeId, windows: { ...state.windows, [action.id]: { ...existing, isOpen: false, isMinimized: false } } };
    default: return state;
  }
}
