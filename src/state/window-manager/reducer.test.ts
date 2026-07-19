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

  it('resizes the right edge while preserving height', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'about' });
    const resized = windowReducer(opened, { type: 'RESIZE', id: 'about', size: { width: 760, height: 480 }, viewport: { width: 1200, height: 800, taskbarHeight: 36 } });
    expect(resized.windows.about?.size).toEqual({ width: 760, height: 480 });
  });

  it('resizes the bottom edge and bottom-right corner', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'projects' });
    const bottom = windowReducer(opened, { type: 'RESIZE', id: 'projects', size: { width: 820, height: 620 }, viewport: { width: 1440, height: 900, taskbarHeight: 36 } });
    expect(bottom.windows.projects?.size.height).toBe(620);
    const corner = windowReducer(bottom, { type: 'RESIZE', id: 'projects', size: { width: 900, height: 700 }, viewport: { width: 1440, height: 900, taskbarHeight: 36 } });
    expect(corner.windows.projects?.size).toEqual({ width: 900, height: 700 });
  });

  it('enforces minimum dimensions', () => {
    const opened = windowReducer(initialWindowState, { type: 'OPEN', id: 'minesweeper' });
    const resized = windowReducer(opened, { type: 'RESIZE', id: 'minesweeper', size: { width: 1, height: 1 }, viewport: { width: 1200, height: 800, taskbarHeight: 36 } });
    expect(resized.windows.minesweeper?.size).toEqual({ width: 190, height: 280 });
  });

  it('clamps resized windows to viewport and taskbar boundaries', () => {
    let state = windowReducer(initialWindowState, { type: 'OPEN', id: 'contact' });
    state = windowReducer(state, { type: 'MOVE', id: 'contact', position: { x: 700, y: 500 } });
    const resized = windowReducer(state, { type: 'RESIZE', id: 'contact', size: { width: 900, height: 900 }, viewport: { width: 1024, height: 768, taskbarHeight: 36 } });
    expect(resized.windows.contact?.position).toEqual({ x: 700, y: 500 });
    expect(resized.windows.contact?.size).toEqual({ width: 324, height: 232 });
  });

  it('does not resize while maximized and restores the prior dimensions', () => {
    let state = windowReducer(initialWindowState, { type: 'OPEN', id: 'projects' });
    state = windowReducer(state, { type: 'RESIZE', id: 'projects', size: { width: 900, height: 640 }, viewport: { width: 1440, height: 900, taskbarHeight: 36 } });
    state = windowReducer(state, { type: 'TOGGLE_MAXIMIZE', id: 'projects' });
    const ignored = windowReducer(state, { type: 'RESIZE', id: 'projects', size: { width: 400, height: 300 }, viewport: { width: 1440, height: 900, taskbarHeight: 36 } });
    expect(ignored.windows.projects?.size).toEqual({ width: 900, height: 640 });
    const restored = windowReducer(ignored, { type: 'TOGGLE_MAXIMIZE', id: 'projects' });
    expect(restored.windows.projects?.size).toEqual({ width: 900, height: 640 });
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
