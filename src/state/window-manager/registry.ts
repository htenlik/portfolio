import { projects } from '../../content/projects';
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
  experience: definition('experience', 'Experiences', '/icons/briefcase.svg', 190, 88, 720, 500),
  projects: definition('projects', 'My Projects', '/icons/folder.svg', 96, 46, 820, 560),
  minesweeper: definition('minesweeper', 'Minesweeper.exe', '/icons/mine.svg', 280, 76, 200, 290, 190, 280),
  contact: definition('contact', 'Contact', '/icons/contact.svg', 310, 110, 500, 380),
  secret: definition('secret', 'secret.txt', '/icons/secret.svg', 340, 120, 470, 340),
  ...Object.fromEntries(projects.map((project, index) => {
    const id = `project/${project.id}` as const;
    return [id, definition(id, project.title, '/icons/chart.svg', 170 + index * 8, 48 + index * 6, 780, 570)];
  })),
};

export const isWindowId = (value: string): value is WindowId => Object.hasOwn(windowRegistry, value);
