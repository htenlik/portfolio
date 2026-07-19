import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { if (import.meta.env.DEV) console.error('htenlikOS UI error', error, info); }
  returnToDesktop = () => { window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`); this.setState({ hasError: false }); };
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className={styles.fallback}><section role="alertdialog" aria-modal="true" aria-labelledby="error-title"><header id="error-title">Application Error</header><div><span aria-hidden="true">⚠️</span><p><strong>htenlikOS encountered an unexpected problem.</strong><br />Your local preferences have not been changed.</p></div><footer><button className="retro-button" type="button" onClick={this.returnToDesktop}>Return to desktop</button><button className="retro-button" type="button" onClick={() => window.location.reload()}>Reload application</button></footer></section></main>;
  }
}
