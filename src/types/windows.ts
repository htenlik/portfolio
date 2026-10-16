type StaticWindowId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'minesweeper'
  | 'contact'
  | 'secret';

/** Case-study windows are created from src/content/projects.ts, one per project id. */
export type ProjectWindowId = `project/${string}`;
export type WindowId = StaticWindowId | ProjectWindowId;

export interface Point { x: number; y: number }
export interface Size { width: number; height: number }
export type ResizeDirection = 'right' | 'bottom' | 'bottom-right';
export interface ResizeViewport extends Size { taskbarHeight: number }

export interface WindowDefinition {
  id: WindowId;
  title: string;
  icon: string;
  defaultPosition: Point;
  defaultSize: Size;
  minSize: Size;
}

export interface WindowInstance extends WindowDefinition {
  position: Point;
  size: Size;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
}

export type WindowMap = Partial<Record<StaticWindowId, WindowInstance>> & { [id: ProjectWindowId]: WindowInstance };
