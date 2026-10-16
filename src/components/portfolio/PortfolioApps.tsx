import { useState, type KeyboardEvent } from 'react';
import { contact, type PublicContact } from '../../content/contact';
import { experience, training, type ExperienceEntry } from '../../content/experience';
import { profile } from '../../content/profile';
import { getProject, isShortcut, projectEntries, type Project, type ProjectCategory, type ProjectEntry } from '../../content/projects';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import styles from './PortfolioApps.module.css';

export function AboutApp() {
  return <article className={styles.about}><section className={styles.propertyPage}><header><img src="/icons/ht-mark.svg" alt="HT" /><div><h2>{profile.name}</h2><strong>{profile.headline}</strong><span>{profile.location}</span></div></header><fieldset><legend>System</legend><p className={styles.summary}>{profile.summary}</p><dl><div><dt>Education:</dt><dd>{profile.education}</dd></div></dl></fieldset><fieldset><legend>Installed technologies</legend><div className={styles.techGrid}>{Object.entries(profile.technologies).map(([group, technologies]) => <section key={group}><h3>{group}</h3><ul className={styles.tags}>{technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></section>)}</div></fieldset><p className={styles.links}>{profile.links.map((link) => <a className="retro-button" key={link.href} href={link.href} target="_blank" rel="noreferrer"><img src="/icons/github.svg" alt="" />{link.label}</a>)}{contact.linkedin && <a className="retro-button" href={contact.linkedin} target="_blank" rel="noreferrer"><img src="/icons/linkedin.svg" alt="" />LinkedIn</a>}</p></section></article>;
}

const menuOptions: Record<string, readonly string[]> = {
  File: ['Open', 'Print…', 'Close'], Edit: ['Select All', 'Copy'], View: ['Details', 'Refresh'], Favorites: ['Add to Favorites'], Tools: ['Folder Options…'], Help: ['Help Topics', 'About this window'],
};

function ClassicMenuBar({ items }: { items: readonly string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return <div className={styles.menuBar} onMouseLeave={() => setOpen(null)}>{items.map((item) => <span className={styles.menuSlot} key={item}><button type="button" aria-haspopup="menu" aria-expanded={open === item} onClick={() => setOpen((value) => value === item ? null : item)}>{item}</button>{open === item && <span className={styles.menuPopup} role="menu">{menuOptions[item]?.map((option) => <button type="button" role="menuitem" key={option} onClick={() => setOpen(null)}>{option}</button>)}</span>}</span>)}</div>;
}

export function ExperienceApp() {
  const [selected, setSelected] = useState<ExperienceEntry>(experience[0]!);
  const list = (items: readonly ExperienceEntry[], icon: string) => items.map((item) => <button key={item.id} type="button" className={selected.id === item.id ? styles.selectedRow : ''} onClick={() => setSelected(item)}><img src={icon} alt="" /><span><strong>{item.organization}</strong><small>{item.dates}</small></span></button>);
  return <div className={styles.application}><ClassicMenuBar items={['File', 'Edit', 'View', 'Help']} /><div className={styles.addressBar}><strong>Address</strong><span><img src="/icons/briefcase.svg" alt="" /> Experiences</span></div><div className={styles.explorer}><aside aria-label="Experiences and training list"><h2>Experiences</h2>{list(experience, '/icons/briefcase.svg')}<h2 className={styles.asideSection}>Training</h2>{list(training, '/icons/document.svg')}</aside><article className={styles.detail}><p className={styles.eyebrow}>{selected.dates}</p><h2>{selected.organization}</h2><h3>{selected.role}</h3>{selected.context && <section className={styles.group}><h4>Overview</h4><p>{selected.context}</p></section>}{selected.contributions.length > 0 && <section className={styles.group}><h4>Responsibilities and contributions</h4><ul>{selected.contributions.map((item) => <li key={item}>{item}</li>)}</ul></section>}{selected.technologies && <section className={styles.group}><h4>Technologies</h4><ul className={styles.tags}>{selected.technologies.map((item) => <li key={item}>{item}</li>)}</ul></section>}</article></div></div>;
}

type FolderName = 'All Projects' | ProjectCategory;
const allCategories: readonly FolderName[] = ['All Projects', 'Professional', 'Full Stack', 'Systems', 'Research', 'Mobile', 'In Progress'];

function NavArrow({ direction }: { direction: 'back' | 'forward' }) {
  return <svg className={styles.navArrow} viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9.5" /><path d={direction === 'back' ? 'M15.5 11h-9m3.5-3.5L6.5 11l3.5 3.5' : 'M6.5 11h9M12 7.5l3.5 3.5-3.5 3.5'} /></svg>;
}

function ProjectRow({ entry }: { entry: ProjectEntry }) {
  const shortcut = isShortcut(entry);
  return <>
    <span className={styles.nameCell}>
      <span className={styles.fileIcon}><img src="/icons/folder.svg" alt="" />{shortcut && <span className={styles.shortcutArrow} />}</span>
      <span className={styles.nameText}><strong>{entry.title}</strong><small>{shortcut ? entry.summary : entry.tagline ?? entry.summary}</small></span>
    </span>
    <span className={styles.categoryCell}>{entry.subtitle}</span>
    <span className={styles.stackCell}>{entry.stack.join(', ')}</span>
    {shortcut && <span className="sr-only">(opens in a new tab)</span>}
  </>;
}

export function ProjectsApp() {
  const folders = allCategories.filter((item) => item === 'All Projects' || projectEntries.some((entry) => entry.categories.includes(item)));
  const [folder, setFolder] = useState<FolderName>('All Projects'); const { openWindow } = useWindowManager();
  const visible = folder === 'All Projects' ? projectEntries : projectEntries.filter((entry) => entry.categories.includes(folder));
  const atRoot = folder === 'All Projects';
  const moveTab = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = folders[(folders.indexOf(folder) + step + folders.length) % folders.length]!;
    setFolder(next);
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-folder="${next}"]`)?.focus();
  };
  return <div className={`${styles.projects} ${styles.application}`}>
    <ClassicMenuBar items={['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']} />
    <div className={styles.toolbar}>
      <button className={styles.navButton} type="button" disabled={atRoot} onClick={() => setFolder('All Projects')}><NavArrow direction="back" />Back</button>
      <button className={styles.navButton} type="button" disabled aria-label="Forward"><NavArrow direction="forward" /></button>
      <button className={styles.navButton} type="button" disabled={atRoot} onClick={() => setFolder('All Projects')} aria-label="Up to All Projects"><span className={styles.upIcon}><img src="/icons/folder.svg" alt="" /><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 9V2M2 5l3-3 3 3" /></svg></span></button>
      <span className={styles.objectCount}>{visible.length} object{visible.length === 1 ? '' : 's'}</span>
    </div>
    <div className={styles.addressBar}><strong>Address</strong><span><img src="/icons/folder.svg" alt="" /> C:\Users\Huseyin\Projects\{folder}</span></div>
    <div className={styles.folderTabs} role="tablist" aria-label="Project categories">
      {folders.map((item) => <button key={item} type="button" role="tab" data-folder={item} aria-selected={folder === item} tabIndex={folder === item ? 0 : -1} onClick={() => setFolder(item)} onKeyDown={moveTab}><img src="/icons/folder.svg" alt="" />{item}</button>)}
    </div>
    <div className={styles.detailsView} role="tabpanel" aria-label={folder}>
      <div className={styles.columnHeaders} aria-hidden="true"><span>Name</span><span>Category</span><span>Stack</span></div>
      <ul className={styles.fileList}>
        {visible.map((entry) => <li key={entry.id}>{isShortcut(entry)
          ? <a className={styles.fileRow} href={entry.href} target="_blank" rel="noreferrer"><ProjectRow entry={entry} /></a>
          : <button className={styles.fileRow} type="button" onClick={() => openWindow(`project/${entry.id}`)}><ProjectRow entry={entry} /></button>}</li>)}
      </ul>
    </div>
  </div>;
}

export function ProjectDetailApp({ id }: { id: string }) {
  const project = getProject(id); if (!project) return <p>Project information is unavailable.</p>;
  return <ProjectCaseStudy project={project} />;
}

function ProjectCaseStudy({ project }: { project: Project }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const current = project.media[selectedMedia] ?? project.media[0];
  const move = (offset: number) => setSelectedMedia((index) => (index + offset + project.media.length) % project.media.length);
  return <article className={styles.caseStudy}>{current && <section className={styles.gallery} aria-label={`${project.title} gallery`}><div className={styles.galleryStage}>{current.kind === 'document' ? <iframe className={styles.documentPreview} src={`${current.src}#view=FitH&toolbar=1`} title={current.alt} /> : <img src={current.src} alt={current.alt} onError={(event) => { event.currentTarget.hidden = true; }} />}{project.media.length > 1 && <><button type="button" className={styles.galleryPrevious} aria-label="Previous image" onClick={() => move(-1)}>‹</button><button type="button" className={styles.galleryNext} aria-label="Next image" onClick={() => move(1)}>›</button></>}</div><div className={styles.galleryStrip}>{project.media.map((media, index) => <button type="button" key={`${media.src}-${index}`} aria-label={`Show image ${index + 1}: ${media.alt}`} aria-pressed={selectedMedia === index} onClick={() => setSelectedMedia(index)}><img src={media.thumbnail ?? media.src} alt="" /><span>{index + 1}</span></button>)}</div><p>{selectedMedia + 1} of {project.media.length} · {current.alt}</p></section>}<div className={styles.caseBody}><p className={styles.eyebrow}>{project.subtitle} · {project.status}</p><h2>{project.title}</h2><p className={styles.lede}>{project.summary}</p><section><h3>Role</h3><p>{project.role}</p></section><section><h3>Challenge</h3><p>{project.challenge}</p></section><section><h3>Contributions</h3><ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Outcomes</h3><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Technologies</h3><ul className={styles.tags}>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul></section>{project.confidentialityNote && <p className={styles.note}>{project.confidentialityNote}</p>}<p className={styles.projectActions}>{project.links.map((link) => <a className={styles.action} key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.icon && <img src={link.icon} alt="" />}{link.label} ↗</a>)}</p></div></article>;
}

export function ContactApp({ details = contact }: { details?: PublicContact } = {}) {
  const [message, setMessage] = useState('');
  const copy = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); setMessage(`${label} copied to clipboard.`); } catch { setMessage('Copy is unavailable in this browser.'); } };
  return <article className={styles.contact}><header><img src="/icons/contact.svg" alt="" /><div><h2>Contact</h2><p>Contact details for Hüseyin Tenlik</p></div></header><section className={styles.addressBook} aria-label="Contact details"><div className={styles.address}><span><strong>Email</strong><span>{details.email.display}</span></span><span className={styles.actions}><button className="retro-button" type="button" onClick={() => void copy(details.email.address, 'Email address')}>Copy</button><a className="retro-button" href={details.email.mailto}>Send email</a></span></div>{details.links.map((link) => <div className={styles.address} key={link.href}><span><strong>{link.label}</strong><a href={link.href} target="_blank" rel="noreferrer">{link.value}</a></span><span className={styles.actions}><button className="retro-button" type="button" onClick={() => void copy(link.value, link.label)}>Copy</button><a className="retro-button" href={link.href} target="_blank" rel="noreferrer">Open profile</a></span></div>)}{details.linkedin && <div className={styles.address}><span><strong>LinkedIn</strong><a href={details.linkedin} target="_blank" rel="noreferrer">{details.linkedin}</a></span><span className={styles.actions}><button className="retro-button" type="button" onClick={() => void copy(details.linkedin!, 'LinkedIn')}>Copy</button><a className="retro-button" href={details.linkedin} target="_blank" rel="noreferrer">Open profile</a></span></div>}</section><p className={styles.feedback} role="status" aria-live="polite">{message}</p></article>;
}
