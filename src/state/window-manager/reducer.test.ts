import { describe, expect, it } from 'vitest';
import { initialWindowState, windowReducer, type WindowAction } from './reducer';

describe('windowReducer', () => {
  it('opens a single-instance window without duplicates', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'about' });
    const reopened = windowReducer(opened, { type: 'OPEN', id: 'about' });
    expect(Object.keys(reopened.windows)).toEqual(['about']);
    expect(reopened.windows.about?.isOpen).toBe(true);
  });

  it('focuses a window and raises its z-index', () => {
    const about = windowReducer(initialWindowState, { type: 'OPEN', id: 'about' });
    const projects = windowReducer(about, { type: 'OPEN', id: 'projects' });
    const focused = windowReducer(projects, { type: 'FOCUS', id: 'about' });
    expect(focused.activeId).toBe('about');
    expect(focused.windows.about!.zIndex).toBeGreaterThan(focused.windows.projects!.zIndex);
  });

  it('minimizes and restores an open window', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'about' });
    const minimized = windowReducer(opened, { type: 'MINIMIZE', id: 'about' });
    expect(minimized.windows.about?.isMinimized).toBe(true);
    const restored = windowReducer(minimized, { type: 'RESTORE', id: 'about' });
    expect(restored.windows.about?.isMinimized).toBe(false);
    expect(restored.activeId).toBe('about');
  });

  it('maximizes and unmaximizes a window', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'projects' });
    const maximized = windowReducer(opened, { type: 'TOGGLE_MAXIMIZE', id: 'projects' });
    expect(maximized.windows.projects?.isMaximized).toBe(true);
    const restored = windowReducer(maximized, { type: 'TOGGLE_MAXIMIZE', id: 'projects' });
    expect(restored.windows.projects?.isMaximized).toBe(false);
  });

  it('closes and reopens a window while keeping one instance', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'contact' });
    const closed = windowReducer(opened, { type: 'CLOSE', id: 'contact' });
    expect(closed.windows.contact?.isOpen).toBe(false);
    const reopened = windowReducer(closed, { type: 'OPEN', id: 'contact' });
    expect(reopened.windows.contact?.isOpen).toBe(true);
    expect(Object.keys(reopened.windows)).toHaveLength(1);
  });

  it('ignores actions for unknown IDs safely', () => {
    const action = { type: 'CLOSE', id: 'unknown' } as unknown as WindowAction;
    expect(windowReducer(initialWindowState, action)).toEqual(initialWindowState);
  });
});
