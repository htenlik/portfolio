import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../app/App';
import { Desktop } from '../components/desktop/Desktop';
import { ResumeApp } from '../components/portfolio/PortfolioApps';
import { Taskbar } from '../components/taskbar/Taskbar';
import { WindowManagerProvider, useWindowManager } from '../state/window-manager/WindowManagerContext';

function StateProbe() { const { state } = useWindowManager(); return <output data-testid="state">{JSON.stringify(state)}</output>; }

describe('portfolio UI behavior', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.setItem('htenlikos-booted', 'true'); window.history.replaceState(null, '', '/'); vi.stubGlobal('open', vi.fn()); });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it('opens a window from a desktop icon', async () => {
    render(<WindowManagerProvider><Desktop /><StateProbe /></WindowManagerProvider>);
    await userEvent.dblClick(screen.getByRole('button', { name: /my computer, shortcut/i }));
    expect(screen.getByTestId('state')).toHaveTextContent('"about"');
  });

  it('opens and closes the Start menu', async () => {
    render(<WindowManagerProvider><Taskbar /></WindowManagerProvider>);
    await userEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByRole('navigation', { name: 'Start menu' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Start menu' })).not.toBeInTheDocument();
  });

  it('restores a minimized window from its taskbar button', async () => {
    render(<WindowManagerProvider><Desktop /><Taskbar /><StateProbe /></WindowManagerProvider>);
    await userEvent.dblClick(screen.getByRole('button', { name: /my computer, shortcut/i }));
    const task = screen.getByRole('button', { name: /my computer — about/i });
    await userEvent.click(task);
    expect(screen.getByTestId('state')).toHaveTextContent('"isMinimized":true');
    await userEvent.click(task);
    expect(screen.getByTestId('state')).toHaveTextContent('"isMinimized":false');
  });

  it('shows secret.txt after a stored Minesweeper victory', () => {
    localStorage.setItem('htenlikos-minesweeper-won', 'true');
    render(<App />);
    expect(screen.getByRole('button', { name: /secret\.txt, shortcut/i })).toBeInTheDocument();
  });

  it('renders a graceful missing-resume fallback', () => {
    render(<ResumeApp />);
    expect(screen.getByText('The public resume PDF has not been added to this repository yet.')).toBeInTheDocument();
  });
});
