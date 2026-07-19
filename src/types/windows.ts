export type WindowId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'resume'
  | 'minesweeper'
  | 'contact'
  | 'secret'
  | 'project/jotform-sign-analytics'
  | 'project/internship-workflow-management'
  | 'project/tasinmaz-management-system'
  | 'project/mpi-gather-torus';

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
