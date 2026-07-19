import { BootScreen } from '../components/boot/BootScreen';
import { Desktop } from '../components/desktop/Desktop';
import { Taskbar } from '../components/taskbar/Taskbar';
import { AppWindow } from '../components/window/AppWindow';
import { AboutApp, ContactApp, ExperienceApp, ProjectDetailApp, ProjectsApp, ResumeApp } from '../components/portfolio/PortfolioApps';
import { useHashWindows } from '../hooks/useHashWindows';
import { WindowManagerProvider, useWindowManager } from '../state/window-manager/WindowManagerContext';
import styles from './App.module.css';

function Shell() {
  useHashWindows();
  const { state } = useWindowManager();
  return (
    <main className={styles.shell}>
      <Desktop />
      {Object.values(state.windows).map((item) => {
        let content = <div className={styles.comingSoon}><img src={item.icon} alt="" /><h2>{item.title}</h2><p>This application is being prepared.</p></div>;
        if (item.id === 'about') content = <AboutApp />;
        if (item.id === 'experience') content = <ExperienceApp />;
        if (item.id === 'projects') content = <ProjectsApp />;
        if (item.id === 'resume') content = <ResumeApp />;
        if (item.id === 'contact') content = <ContactApp />;
        if (item.id.startsWith('project/')) content = <ProjectDetailApp id={item.id.slice(8) as Parameters<typeof ProjectDetailApp>[0]['id']} />;
        return <AppWindow key={item.id} window={item}>{content}</AppWindow>;
      })}
      <Taskbar />
      <BootScreen />
    </main>
  );
}

export function App() { return <WindowManagerProvider><Shell /></WindowManagerProvider>; }
