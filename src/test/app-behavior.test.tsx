import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../app/App';
import { Desktop } from '../components/desktop/Desktop';
import { ContactApp, ResumeApp } from '../components/portfolio/PortfolioApps';
import { contact } from '../content/contact';
import { resumeDownloadName, resumeFile } from '../content/resume';
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

  it('selects and moves a desktop shortcut onto the classic grid', async () => {
    render(<WindowManagerProvider><Desktop /></WindowManagerProvider>);
    const shortcut = screen.getByRole('button', { name: /my computer, shortcut/i });
    expect(shortcut).toHaveAttribute('aria-selected', 'false');
    fireEvent.pointerDown(shortcut, { button: 0, pointerId: 1, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(shortcut, { pointerId: 1, clientX: 130, clientY: 105 });
    fireEvent.pointerUp(shortcut, { pointerId: 1, clientX: 130, clientY: 105 });
    expect(shortcut).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('htenlikos-desktop-layout-v1') ?? '{}') as Record<string, { x: number; y: number }>;
      expect(stored.about).toEqual({ x: 97, y: 94 });
    });
  });

  it('provides shortcut and desktop context menus', () => {
    const { container } = render(<WindowManagerProvider><Desktop /></WindowManagerProvider>);
    fireEvent.contextMenu(screen.getByRole('button', { name: /my computer, shortcut/i }), { clientX: 30, clientY: 30 });
    expect(screen.getByRole('menu', { name: 'My Computer context menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Properties' })).toBeInTheDocument();
    fireEvent.contextMenu(container.querySelector('[role="list"]')!, { clientX: 300, clientY: 200 });
    expect(screen.getByRole('menu', { name: 'Desktop context menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Arrange Icons' })).toBeInTheDocument();
  });

  it('opens and closes the Start menu', async () => {
    render(<WindowManagerProvider><Taskbar /></WindowManagerProvider>);
    await userEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(screen.getByRole('navigation', { name: 'Start menu' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Start menu' })).not.toBeInTheDocument();
  });

  it('launches Expert Minesweeper from the Shut Down dialog', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'start' }));
    await userEvent.click(screen.getByRole('button', { name: 'Shut Down' }));
    expect(screen.getByText(/Before shutting down, you have to beat Expert-level Minesweeper/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Play Expert Minesweeper' }));
    expect(screen.getByRole('grid', { name: '16 by 30 Minesweeper board' })).toBeInTheDocument();
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
    render(<ResumeApp expectedAvailable={false} />);
    expect(screen.getByText('The resume is temporarily unavailable. Please try again later.')).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/public\/|repository|configure/i);
  });

  it('uses the configured resume path for open, download, and preview', () => {
    const { container } = render(<ResumeApp expectedAvailable />);
    expect(screen.getByRole('link', { name: 'Open PDF' })).toHaveAttribute('href', resumeFile);
    expect(screen.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('download', resumeDownloadName);
    expect(container.querySelector('iframe')).toHaveAttribute('src', '/huseyin_tenlik_cv.pdf#view=FitH&toolbar=1');
  });

  it('shows and copies only the obfuscated email value', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ContactApp />);
    expect(screen.getByText('h[dot]tenlik7677[at]gmail[dot]com')).toBeInTheDocument();
    expect(screen.queryByText('h.tenlik7677@gmail.com')).not.toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Copy' })[0]!);
    expect(writeText).toHaveBeenCalledWith(contact.email.address);
    expect(screen.getByRole('status')).toHaveTextContent('Email address copied to clipboard.');
  });

  it('renders LinkedIn only when it is configured', () => {
    const { rerender } = render(<ContactApp details={{ email: contact.email, links: contact.links }} />);
    expect(screen.queryByText(contact.linkedin!)).not.toBeInTheDocument();
    rerender(<ContactApp />);
    expect(screen.getByText(contact.linkedin!)).toHaveAttribute('href', contact.linkedin);
  });

  it('copies GitHub and LinkedIn profile URLs', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ContactApp />);
    const copyButtons = screen.getAllByRole('button', { name: 'Copy' });
    await userEvent.click(copyButtons[1]!);
    await userEvent.click(copyButtons[2]!);
    expect(writeText).toHaveBeenNthCalledWith(1, 'https://github.com/htenlik');
    expect(writeText).toHaveBeenNthCalledWith(2, contact.linkedin);
  });
});
