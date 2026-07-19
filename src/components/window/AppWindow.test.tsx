import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../app/App';
import { useWindowManager, WindowManagerProvider } from '../../state/window-manager/WindowManagerContext';
import { AppWindow } from './AppWindow';

function WindowHarness() {
  const manager = useWindowManager();
  const current = manager.state.windows.about;
  return <><button type="button" onClick={() => manager.openWindow('about', false)}>Open about</button>{current && <AppWindow window={current}><div style={{ height: 1200 }}>About content</div></AppWindow>}<output data-testid="window-state">{JSON.stringify(current)}</output></>;
}

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { configurable: true, value: vi.fn() });
  sessionStorage.setItem('htenlikos-booted', 'true');
  window.history.replaceState(null, '', '/');
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('AppWindow resizing and scroll state', () => {
  it.each([
    ['right', 100, 0, '"width":750', '"height":480'],
    ['bottom', 0, 80, '"width":650', '"height":560'],
    ['bottom-right', 100, 80, '"width":750', '"height":560'],
  ])('resizes from the %s handle', async (direction, deltaX, deltaY, width, height) => {
    const { container } = render(<WindowManagerProvider><WindowHarness /></WindowManagerProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Open about' }));
    const handle = container.querySelector<HTMLElement>(`[data-direction="${direction}"]`)!;
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 100, button: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 100 + deltaX, clientY: 100 + deltaY });
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(screen.getByTestId('window-state')).toHaveTextContent(width);
    expect(screen.getByTestId('window-state')).toHaveTextContent(height);
  });

  it('drags a desktop window by its title bar within the usable viewport', async () => {
    const { container } = render(<WindowManagerProvider><WindowHarness /></WindowManagerProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Open about' }));
    const titlebar = container.querySelector<HTMLElement>('section[aria-label="My Computer — About"] > div')!;
    fireEvent.pointerDown(titlebar, { pointerId: 2, clientX: 200, clientY: 80, button: 0 });
    fireEvent.pointerMove(titlebar, { pointerId: 2, clientX: 250, clientY: 110 });
    fireEvent.pointerUp(titlebar, { pointerId: 2 });
    expect(screen.getByTestId('window-state')).toHaveTextContent('"position":{"x":178,"y":94}');
  });

  it('starts a newly opened window at the top of its content', async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: scrollTo });
    render(<WindowManagerProvider><WindowHarness /></WindowManagerProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Open about' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0 });
  });

  it('starts a hash-opened window at the top of its content', async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: scrollTo });
    window.history.replaceState(null, '', '/#about');
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText('My Computer — About')).toBeInTheDocument());
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0 });
  });
});
