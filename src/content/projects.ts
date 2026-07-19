export type ProjectCategory = 'Professional' | 'Full Stack' | 'Systems' | 'In Progress';
export interface ProjectLink { label: string; href: string; icon?: string }
export interface ProjectMedia { src: string; alt: string; kind: 'concept' | 'sanitized' | 'diagram' }
export interface Project {
  id: 'jotform-sign-analytics' | 'internship-workflow-management' | 'tasinmaz-management-system' | 'mpi-gather-torus';
  title: string; subtitle: string; categories: readonly ProjectCategory[]; status: string; year?: string; summary: string; role: string;
  challenge: string; contributions: readonly string[]; technologies: readonly string[]; outcomes: readonly string[]; links: readonly ProjectLink[];
  media: readonly ProjectMedia[]; confidentialityNote?: string; featured: boolean;
}

export const projects: readonly Project[] = [
  {
    id: 'jotform-sign-analytics', title: 'Jotform Sign Analytics', subtitle: 'Professional / Analytics', categories: ['Professional'], status: 'Private Company Project — Presented in Demo', year: '2026', featured: true,
    role: 'Backend Developer in a three-person team', summary: 'An analytics experience for electronic signing workflows, designed to turn raw event and session activity into understandable engagement, friction, and document-health insights.',
    challenge: 'Raw analytics data was technically dense and difficult to interpret. Session behavior, field interaction, completion state, and AI-generated reporting needed consistent backend semantics and clearer user-facing explanations.',
    contributions: ['Built and refined analytics filters for date, country, and completion status.', 'Applied filters before aggregation to keep dashboard and report results consistent.', 'Implemented engagement metrics and daily time-series calculations.', 'Worked on consistent event/session grouping and analytics behavior.', 'Developed an evidence-based 0–100 field-friction model.', 'Added confidence and explainable friction signals.', 'Improved health assessment logic for low-data, healthy, attention, and critical states.', 'Converted internal metric-style AI outputs into user-friendly language.', 'Added supporting enrichment such as document titles and signer email handling where data was available.', 'Participated in preparing and presenting the internship demo.'],
    technologies: ['PHP', 'REST APIs', 'Analytics aggregation', 'Data modeling', 'AI-assisted reporting', 'Backend engineering'], outcomes: ['Consistent analytics semantics', 'Explainable field-friction insights', 'Clearer user-facing health reporting'], links: [],
    media: [{ src: '/media/projects/jotform/jotform-analytics-preview.svg', alt: 'Sanitized concept showing analytics cards, engagement chart, field friction, and document health', kind: 'sanitized' }],
  },
  {
    id: 'internship-workflow-management', title: 'Internship Workflow Management System', subtitle: 'Full Stack / Workflow', categories: ['Full Stack'], status: 'Public Prototype', featured: true,
    role: 'Full-stack development', summary: 'A prototype for Hacettepe University Computer Engineering that digitizes internship workflows across authentication, reports, semesters, and supervisor verification.',
    challenge: 'Coordinate role-based internship processes and supporting documents through a single authenticated workflow.',
    contributions: ['Implemented a React and Vite frontend with protected, role-based pages.', 'Built Spring Boot services using Spring Data JPA and Spring Security.', 'Supported internship report drafts, submission, PDF upload, and status tracking.', 'Modeled semester administration and supervisor request, token, and OTP verification flows.', 'Containerized the PostgreSQL development database with Docker Compose.'],
    technologies: ['React', 'Vite', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'JWT', 'PostgreSQL', 'Docker'], outcomes: ['Working public prototype', 'Role-aware internship workflows', 'Document and verification flows'],
    links: [
      { label: 'View Repository', href: 'https://github.com/htenlik/Internship-Workflow-Management-System' },
      { label: 'Go to Live Demo', href: 'https://internship-workflow-management-syst.vercel.app/', icon: '/icons/globe.svg' },
    ],
    media: [{ src: '/media/projects/internship-workflow/internship-workflow-preview.svg', alt: 'Conceptual internship workflow from applicant through completion', kind: 'concept' }],
  },
  {
    id: 'tasinmaz-management-system', title: 'Taşınmaz Yönetim Sistemi', subtitle: 'Full Stack / GIS', categories: ['Full Stack'], status: 'Public Project', featured: true,
    role: 'Full-stack development', summary: 'A full-stack real-estate management application combining an Angular frontend, an ASP.NET Core API, structured location data, authentication, logging, export features, and map-based property visualization.',
    challenge: 'Manage property and user data across a structured location hierarchy while supporting secure, searchable, map-oriented workflows.',
    contributions: ['Built the Angular 15 and TypeScript frontend with Bootstrap 5.', 'Implemented an ASP.NET Core Web API targeting .NET 8 with Entity Framework Core.', 'Added JWT authentication and a layered backend structure.', 'Modeled province, district, neighborhood, and property relationships.', 'Implemented user management, property CRUD, filtering, pagination, and action logging.', 'Added Excel export and OpenLayers map visualization.'],
    technologies: ['Angular 15', 'TypeScript', 'Bootstrap 5', 'ASP.NET Core Web API', '.NET 8', 'Entity Framework Core', 'JWT', 'OpenLayers'], outcomes: ['Location-aware property workflows', 'Authenticated CRUD and user administration', 'Logging, export, and map visualization'],
    links: [{ label: 'View Repository', href: 'https://github.com/htenlik/Tasinmaz-Management-System' }],
    media: [{ src: '/media/projects/tasinmaz/tasinmaz-preview.svg', alt: 'Sanitized property-management layout with filters, records, map, and location hierarchy', kind: 'sanitized' }],
  },
  {
    id: 'mpi-gather-torus', title: 'MPI Gather over Torus Topology', subtitle: 'Systems / Parallel Computing', categories: ['Systems'], status: 'Technical Case Study', featured: true,
    role: 'Systems design and implementation study', summary: 'A parallel-computing study exploring gather-style communication over a torus process topology using MPI.',
    challenge: 'Reason about gather communication, coordination, and evaluation when processes are arranged in a topology with horizontal and vertical wrap-around links.',
    contributions: ['Defined the torus process-topology model.', 'Structured directional communication toward a highlighted root.', 'Documented implementation considerations for distributed coordination.', 'Prepared an evaluation methodology without presenting unverified benchmark claims.'],
    technologies: ['MPI', 'Parallel computing', 'Distributed coordination', 'Process topologies'], outcomes: ['Problem and topology framing', 'Communication-approach documentation', 'Reproducible evaluation structure'], links: [],
    media: [{ src: '/media/projects/mpi-torus/mpi-torus-preview.svg', alt: 'Four by four torus topology with wrap-around links and highlighted root process', kind: 'diagram' }],
    confidentialityNote: 'Detailed benchmark captures and terminal output will be added after the results are prepared for public presentation.',
  },
];

export const getProject = (id: Project['id']) => projects.find((project) => project.id === id);
