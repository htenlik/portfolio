import type { WindowDefinition, WindowId } from '../../types/windows';

const definition = (
  id: WindowId,
  title: string,
  icon: string,
  x: number,
  y: number,
  width: number,
  height: number,
  minWidth = 300,
  minHeight = 220,
): WindowDefinition => ({
  id, title, icon, defaultPosition: { x, y }, defaultSize: { width, height }, minSize: { width: minWidth, height: minHeight },
});

export const windowRegistry: Record<WindowId, WindowDefinition> = {
  about: definition('about', 'My Computer — About', '/icons/computer.svg', 128, 64, 650, 480),
  experience: definition('experience', 'Work Experience', '/icons/briefcase.svg', 190, 88, 720, 500),
  projects: definition('projects', 'My Projects', '/icons/folder.svg', 96, 46, 820, 560),
  resume: definition('resume', 'Resume.pdf', '/icons/document.svg', 235, 58, 660, 540),
  minesweeper: definition('minesweeper', 'Minesweeper.exe', '/icons/mine.svg', 280, 76, 390, 500, 330, 420),
  contact: definition('contact', 'Contact', '/icons/contact.svg', 310, 110, 500, 380),
  secret: definition('secret', 'secret.txt', '/icons/secret.svg', 340, 120, 470, 340),
  'project/jotform-sign-analytics': definition('project/jotform-sign-analytics', 'Jotform Sign Analytics', '/icons/chart.svg', 170, 48, 780, 570),
  'project/internship-workflow-management': definition('project/internship-workflow-management', 'Internship Workflow Management System', '/icons/chart.svg', 180, 56, 780, 570),
  'project/tasinmaz-management-system': definition('project/tasinmaz-management-system', 'Taşınmaz Yönetim Sistemi', '/icons/chart.svg', 190, 64, 780, 570),
  'project/mpi-gather-torus': definition('project/mpi-gather-torus', 'MPI Gather over Torus Topology', '/icons/chart.svg', 200, 72, 780, 570),
};

export const isWindowId = (value: string): value is WindowId => value in windowRegistry;
