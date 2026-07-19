import { BootScreen } from '../components/boot/BootScreen';
import { Desktop } from '../components/desktop/Desktop';
import { Taskbar } from '../components/taskbar/Taskbar';
import { AppWindow } from '../components/window/AppWindow';
import { AboutApp, ContactApp, ExperienceApp, ProjectDetailApp, ProjectsApp, ResumeApp } from '../components/portfolio/PortfolioApps';
import { Minesweeper } from '../components/minesweeper/Minesweeper';
import { CongratulationsDialog } from '../components/dialogs/CongratulationsDialog';
import { useCallback, useState } from 'react';
import { useHashWindows } from '../hooks/useHashWindows';
import { WindowManagerProvider, useWindowManager } from '../state/window-manager/WindowManagerContext';
import styles from './App.module.css';

function Shell() {
  useHashWindows();
  const { state } = useWindowManager();
  const [secretVisible, setSecretVisible] = useState(() => { try { return localStorage.getItem('htenlikos-minesweeper-won') === 'true'; } catch { return false; } });
  const [congratulations, setCongratulations] = useState(false);
  const unlockSecret = useCallback(() => { try { localStorage.setItem('htenlikos-minesweeper-won', 'true'); } catch { /* the in-memory unlock still works */ } setSecretVisible(true); setCongratulations(true); }, []);
  return (
    <main className={styles.shell}>
      <Desktop secretVisible={secretVisible} />
      {Object.values(state.windows).map((item) => {
        let content = <div className={styles.comingSoon}><img src={item.icon} alt="" /><h2>{item.title}</h2><p>This application is being prepared.</p></div>;
        if (item.id === 'about') content = <AboutApp />;
        if (item.id === 'experience') content = <ExperienceApp />;
        if (item.id === 'projects') content = <ProjectsApp />;
        if (item.id === 'resume') content = <ResumeApp />;
        if (item.id === 'contact') content = <ContactApp />;
        if (item.id === 'minesweeper') content = <Minesweeper onWin={unlockSecret} />;
        if (item.id === 'secret') content = <article className={styles.secret}><img src="/icons/secret.svg" alt="" /><p>You cleared the field.</p><p>That probably means you are persistent enough to inspect the rest of the system too.</p><p>Thanks for visiting htenlikOS.</p><a href="https://github.com/htenlik/portfolio" target="_blank" rel="noreferrer">View the source ↗</a></article>;
        if (item.id.startsWith('project/')) content = <ProjectDetailApp id={item.id.slice(8) as Parameters<typeof ProjectDetailApp>[0]['id']} />;
        return <AppWindow key={item.id} window={item}>{content}</AppWindow>;
      })}
      <Taskbar />
      {congratulations && <CongratulationsDialog onClose={() => setCongratulations(false)} />}
      <BootScreen />
    </main>
  );
}

export function App() { return <WindowManagerProvider><Shell /></WindowManagerProvider>; }
