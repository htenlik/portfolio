import { useState } from 'react';
import { contactLinks } from '../../content/contact';
import { experience } from '../../content/experience';
import { profile } from '../../content/profile';
import { getProject, projects, type Project, type ProjectCategory } from '../../content/projects';
import { resumeFile } from '../../content/resume';
import { useWindowManager } from '../../state/window-manager/WindowManagerContext';
import type { WindowId } from '../../types/windows';
import styles from './PortfolioApps.module.css';

export function AboutApp() {
  return <article className={styles.about}><header><img src="/icons/ht-mark.svg" alt="HT" /><div><h2>{profile.name}</h2><strong>{profile.headline}</strong><span>{profile.location}</span></div></header><p className={styles.summary}>{profile.summary}</p><dl><div><dt>Education</dt><dd>{profile.education}</dd></div></dl><div className={styles.techGrid}>{Object.entries(profile.technologies).map(([group, technologies]) => <section key={group}><h3>{group}</h3><ul className={styles.tags}>{technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></section>)}</div><p className={styles.links}>{profile.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</p></article>;
}

export function ExperienceApp() {
  const [selected, setSelected] = useState(0); const current = experience[selected] ?? experience[0]!;
  return <div className={styles.explorer}><aside aria-label="Experience list">{experience.map((item, index) => <button key={item.organization} type="button" className={selected === index ? styles.selectedRow : ''} onClick={() => setSelected(index)}><img src="/icons/briefcase.svg" alt="" /><span><strong>{item.organization}</strong><small>{item.role}</small></span></button>)}</aside><article className={styles.detail}><p className={styles.eyebrow}>{current.year ?? 'Experience'}</p><h2>{current.organization}</h2><h3>{current.role}</h3>{current.context && <p>{current.context}</p>}<ul>{current.contributions.map((item) => <li key={item}>{item}</li>)}</ul>{current.technologies && <ul className={styles.tags}>{current.technologies.map((item) => <li key={item}>{item}</li>)}</ul>}{current.note && <p className={styles.note}>{current.note}</p>}</article></div>;
}

const categories: readonly ('All Projects' | ProjectCategory)[] = ['All Projects', 'Professional', 'Full Stack', 'Systems', 'In Progress'];
export function ProjectsApp() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All Projects'); const { openWindow } = useWindowManager();
  const visible = category === 'All Projects' ? projects : projects.filter((project) => project.categories.includes(category));
  return <div className={styles.projects}><div className={styles.toolbar}><button className="retro-button" type="button" onClick={() => setCategory('All Projects')}>⌂ All projects</button><span>{visible.length} object{visible.length === 1 ? '' : 's'}</span></div><div className={styles.explorer}><aside aria-label="Project categories">{categories.map((item) => <button key={item} type="button" className={category === item ? styles.selectedRow : ''} onClick={() => setCategory(item)}>📁 {item}</button>)}</aside><div className={styles.projectGrid}>{visible.map((project) => <button type="button" key={project.id} className={styles.projectCard} onClick={() => openWindow(`project/${project.id}` as WindowId)}><img src={project.media[0]?.src} alt="" /><span><small>{project.subtitle}</small><strong>{project.title}</strong><em>{project.status}</em><span>{project.summary}</span><b>Open details →</b></span></button>)}</div></div></div>;
}

export function ProjectDetailApp({ id }: { id: Project['id'] }) {
  const project = getProject(id); if (!project) return <p>Project information is unavailable.</p>;
  return <article className={styles.caseStudy}><img className={styles.preview} src={project.media[0]?.src} alt={project.media[0]?.alt ?? ''} onError={(event) => { event.currentTarget.hidden = true; }} /><div className={styles.caseBody}><p className={styles.eyebrow}>{project.subtitle} · {project.status}</p><h2>{project.title}</h2><p className={styles.lede}>{project.summary}</p><section><h3>Role</h3><p>{project.role}</p></section><section><h3>Challenge</h3><p>{project.challenge}</p></section><section><h3>Contributions</h3><ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Outcomes</h3><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3>Technologies</h3><ul className={styles.tags}>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul></section>{project.confidentialityNote && <p className={styles.note}>{project.confidentialityNote}</p>}{project.links.map((link) => <a className={styles.action} key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></article>;
}

export function ResumeApp() {
  if (!resumeFile) return <article className={styles.empty}><img src="/icons/document.svg" alt="" /><h2>Resume viewer</h2><p>The public resume PDF has not been added to this repository yet.</p><p>To publish it, place the reviewed file at <code>public/Huseyin-Tenlik-CV.pdf</code> and set its path in the resume content file.</p></article>;
  return <div className={styles.resume}><nav><a className="retro-button" href={resumeFile} target="_blank" rel="noreferrer">View PDF</a><a className="retro-button" href={resumeFile} download>Download PDF</a></nav><object data={resumeFile} type="application/pdf" aria-label="Hüseyin Tenlik resume preview"><p>PDF preview is unavailable. <a href={resumeFile}>Open the resume.</a></p></object></div>;
}

export function ContactApp() {
  const [message, setMessage] = useState('');
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); setMessage('Copied to clipboard.'); } catch { setMessage('Copy unavailable. Select the address instead.'); } };
  return <article className={styles.contact}><header><img src="/icons/contact.svg" alt="" /><div><h2>Contact</h2><p>Public ways to find Hüseyin online.</p></div></header>{contactLinks.map((link) => <div className={styles.address} key={link.href}><span><strong>{link.label}</strong><a href={link.href} target="_blank" rel="noreferrer">{link.value}</a></span><button className="retro-button" type="button" onClick={() => void copy(link.value)}>Copy</button></div>)}<p className={styles.feedback} aria-live="polite">{message}</p><p className={styles.note}>Email and LinkedIn are omitted because no explicitly public values are stored in this repository.</p></article>;
}
