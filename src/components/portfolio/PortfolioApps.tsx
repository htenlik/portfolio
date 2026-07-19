import { useEffect, useState } from 'react';
import { contact, type PublicContact } from '../../content/contact';
import { experience, training, type ExperienceEntry } from '../../content/experience';
import { profile } from '../../content/profile';
import { getProject, projects, type Project, type ProjectCategory } from '../../content/projects';
import { resumeDownloadName, resumeFile } from '../../content/resume';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { WindowId } from '../../types/windows';
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

const categories: readonly ('All Projects' | ProjectCategory)[] = ['All Projects', 'Professional', 'Full Stack', 'Systems', 'In Progress'];
export function ProjectsApp() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All Projects'); const { openWindow } = useWindowManager();
  const visible = category === 'All Projects' ? projects : projects.filter((project) => project.categories.includes(category));
  return <div className={`${styles.projects} ${styles.application}`}><ClassicMenuBar items={['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help']} /><div className={styles.toolbar}><button className="retro-button" type="button" onClick={() => setCategory('All Projects')}>← Back</button><button className="retro-button" type="button" onClick={() => setCategory('All Projects')}>⌂ Folders</button><span>{visible.length} object{visible.length === 1 ? '' : 's'}</span></div><div className={styles.addressBar}><strong>Address</strong><span><img src="/icons/folder.svg" alt="" /> C:\Portfolio\Projects\{category}</span></div><div className={styles.explorer}><aside aria-label="Project categories"><h2>Project Tasks</h2>{categories.map((item) => <button key={item} type="button" className={category === item ? styles.selectedRow : ''} onClick={() => setCategory(item)}><img src="/icons/folder.svg" alt="" /> {item}</button>)}</aside><div className={styles.projectGrid}>{visible.map((project) => <button type="button" key={project.id} className={styles.projectCard} onClick={() => openWindow(`project/${project.id}` as WindowId)}><img src={project.media[0]?.src} alt="" /><span><strong>{project.title}</strong><small>{project.subtitle} · {project.status}</small><span>{project.summary}</span></span></button>)}</div></div></div>;
}

export function ProjectDetailApp({ id }: { id: Project['id'] }) {
  const project = getProject(id); if (!project) return <p>Project information is unavailable.</p>;
  return <ProjectCaseStudy project={project} />;
}

function ProjectCaseStudy({ project }: { project: Project }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const current = project.media[selectedMedia] ?? project.media[0];
  const move = (offset: number) => setSelectedMedia((index) => (index + offset + project.media.length) % project.media.length);
  return <article className={styles.caseStudy}>{current && <section className={styles.gallery} aria-label={`${project.title} gallery`}><div className={styles.galleryStage}><img src={current.src} alt={current.alt} onError={(event) => { event.currentTarget.hidden = true; }} />{project.media.length > 1 && <><button type="button" className={styles.galleryPrevious} aria-label="Previous image" onClick={() => move(-1)}>‹</button><button type="button" className={styles.galleryNext} aria-label="Next image" onClick={() => move(1)}>›</button></>}</div><div className={styles.galleryStrip}>{project.media.map((media, index) => <button type="button" key={`${media.src}-${index}`} aria-label={`Show image ${index + 1}: ${media.alt}`} aria-pressed={selectedMedia === index} onClick={() => setSelectedMedia(index)}><img src={media.src} alt="" /><span>{index + 1}</span></button>)}</div><p>{selectedMedia + 1} of {project.media.length} · {current.alt}</p></section>}<div className={styles.caseBody}><p className={styles.eyebrow}>{project.subtitle} · {project.status}</p><h2>{project.title}</h2><p className={styles.lede}>{project.summary}</p><section><h3>Role</h3><p>{project.role}</p></section><section><h3>Challenge</h3><p>{project.challenge}</p></section><section><h3>Contributions</h3><ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Outcomes</h3><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Technologies</h3><ul className={styles.tags}>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul></section>{project.confidentialityNote && <p className={styles.note}>{project.confidentialityNote}</p>}{project.links.map((link) => <a className={styles.action} key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></article>;
}

export function ResumeApp({ expectedAvailable }: { expectedAvailable?: boolean } = {}) {
  const [available, setAvailable] = useState<boolean | null>(expectedAvailable ?? null);
  useEffect(() => { if (expectedAvailable !== undefined) return; const controller = new AbortController(); void fetch(resumeFile, { method: 'HEAD', cache: 'no-store', signal: controller.signal }).then((response) => setAvailable(response.ok)).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) setAvailable(false); }); return () => controller.abort(); }, [expectedAvailable]);
  if (available === null) return <article className={styles.empty} aria-live="polite"><img src="/icons/document.svg" alt="" /><h2>Resume viewer</h2><p>Loading resume…</p></article>;
  if (!available) return <article className={styles.empty}><img src="/icons/document.svg" alt="" /><h2>Resume unavailable</h2><p>The resume is temporarily unavailable. Please try again later.</p></article>;
  return <div className={styles.resume}><nav aria-label="Resume actions"><a className="retro-button" href={resumeFile} target="_blank" rel="noreferrer">Open PDF</a><a className="retro-button" href={resumeFile} download={resumeDownloadName}>Download PDF</a></nav><iframe src={`${resumeFile}#view=FitH&toolbar=1`} title="Hüseyin Tenlik resume preview" /></div>;
}

export function ContactApp({ details = contact }: { details?: PublicContact } = {}) {
  const [message, setMessage] = useState('');
  const copy = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); setMessage(`${label} copied to clipboard.`); } catch { setMessage('Copy is unavailable in this browser.'); } };
  return <article className={styles.contact}><header><img src="/icons/contact.svg" alt="" /><div><h2>Contact</h2><p>Contact details for Hüseyin Tenlik</p></div></header><section className={styles.addressBook} aria-label="Contact details"><div className={styles.address}><span><strong>Email</strong><span>{details.email.display}</span></span><span className={styles.actions}><button className="retro-button" type="button" onClick={() => void copy(details.email.address, 'Email address')}>Copy</button><a className="retro-button" href={details.email.mailto}>Send email</a></span></div>{details.links.map((link) => <div className={styles.address} key={link.href}><span><strong>{link.label}</strong><a href={link.href} target="_blank" rel="noreferrer">{link.value}</a></span><span className={styles.actions}><button className="retro-button" type="button" onClick={() => void copy(link.value, link.label)}>Copy</button><a className="retro-button" href={link.href} target="_blank" rel="noreferrer">Open profile</a></span></div>)}{details.linkedin && <div className={styles.address}><span><strong>LinkedIn</strong><a href={details.linkedin} target="_blank" rel="noreferrer">{details.linkedin}</a></span><span className={styles.actions}><button className="retro-button" type="button" onClick={() => void copy(details.linkedin!, 'LinkedIn')}>Copy</button><a className="retro-button" href={details.linkedin} target="_blank" rel="noreferrer">Open profile</a></span></div>}</section><p className={styles.feedback} role="status" aria-live="polite">{message}</p></article>;
}
