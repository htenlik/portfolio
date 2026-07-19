import { BootScreen } from '../components/boot/BootScreen';
import { Desktop } from '../components/desktop/Desktop';
import { Taskbar } from '../components/taskbar/Taskbar';
import { AppWindow } from '../components/window/AppWindow';
import { useHashWindows } from '../hooks/useHashWindows';
import { WindowManagerProvider, useWindowManager } from '../state/window-manager/WindowManagerContext';
import styles from './App.module.css';

function Shell() {
  useHashWindows();
  const { state } = useWindowManager();
  return (
    <main className={styles.shell}>
      <Desktop />
      {Object.values(state.windows).map((item) => <AppWindow key={item.id} window={item}><div className={styles.comingSoon}><img src={item.icon} alt="" /><h2>{item.title}</h2><p>This htenlikOS application is ready for its portfolio content.</p></div></AppWindow>)}
      <Taskbar />
      <BootScreen />
    </main>
  );
}

export function App() { return <WindowManagerProvider><Shell /></WindowManagerProvider>; }
