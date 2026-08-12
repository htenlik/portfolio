export type ProjectCategory = 'Professional' | 'Full Stack' | 'Systems' | 'In Progress';
export interface ProjectLink { label: string; href: string; icon?: string }
export interface ProjectMedia { src: string; alt: string; kind: 'concept' | 'sanitized' | 'diagram' | 'screenshot' | 'visual' | 'document'; thumbnail?: string }
export interface Project {
  id: 'jotform-sign-analytics' | 'internship-workflow-management' | 'tasinmaz-management-system' | 'mpi-gather-torus';
  title: string; subtitle: string; categories: readonly ProjectCategory[]; status: string; year?: string; summary: string; role: string;
  challenge: string; contributions: readonly string[]; technologies: readonly string[]; outcomes: readonly string[]; links: readonly ProjectLink[];
  media: readonly ProjectMedia[]; confidentialityNote?: string; featured: boolean;
}

export const projects: readonly Project[] = [
  {
    id: 'jotform-sign-analytics', title: 'Jotform Sign Analytics', subtitle: 'Professional / Analytics', categories: ['Professional'], status: 'Private Company Project — Presented in Demo', year: '2026', featured: true,
    role: 'Backend Developer in a three-person team', summary: 'An analytics experience for electronic signing workflows, turning raw document, signer, session, and field events into understandable engagement, friction, completion, and document-health insights.',
    challenge: 'Dense event data had to remain consistent across document and date scopes while supporting responsive dashboards, explainable field-level signals, and useful AI-generated guidance.',
    contributions: ['Built consistent REST aggregation for document and global date filters, session activity, field analytics, and trends.', 'Added bounded, paginated all-document and recent-session views with deterministic ordering.', 'Implemented completion-time ranges and journey-stage breakdowns for incomplete signing sessions.', 'Added privacy-aware signer metadata and GeoIP-based country resolution where source data allowed it.', 'Developed an evidence-based 0–100 field-friction model with confidence and explainable signals.', 'Improved document-health and AI insight presentation with safe labels, bounded prompts, human-readable terminology, and expandable recommended actions.', 'Refined the analytics information architecture, cards, charts, colors, controls, and field ordering for faster interpretation.', 'Supported versioned migrations, data cleanup, PHPUnit coverage, and API contract documentation.'],
    technologies: ['PHP', 'REST APIs', 'Analytics aggregation', 'Data modeling', 'GeoIP', 'AI-assisted reporting', 'PHPUnit', 'OpenAPI'], outcomes: ['Consistent analytics semantics across filter scopes', 'Explainable field-friction and journey insights', 'Scalable document/session reporting', 'Clearer user-facing health and AI guidance'], links: [],
    media: [
      { src: '/media/projects/jotform/jotform-signing-trends.webp', alt: 'Signing analytics trends with completion and engagement breakdowns', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-field-analysis.webp', alt: 'Field analysis view showing interaction and friction signals', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-engagement-insights.webp', alt: 'Engagement insights dashboard with session and journey metrics', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-ai-analysis.webp', alt: 'Document health and AI-assisted recommendations view', kind: 'screenshot' },
    ],
  },
  {
    id: 'internship-workflow-management', title: 'Internship Workflow Management System', subtitle: 'Full Stack / Workflow', categories: ['Full Stack'], status: 'Public Prototype', featured: true,
    role: 'Full-stack development', summary: 'A prototype for Hacettepe University Computer Engineering that digitizes internship workflows across authentication, reports, semesters, and supervisor verification.',
    challenge: 'Coordinate role-based internship processes and supporting documents through a single authenticated workflow.',
    contributions: ['Implemented a React and Vite frontend with protected, role-based pages.', 'Built Spring Boot services using Spring Data JPA and Spring Security.', 'Supported internship report drafts, submission, PDF upload, and status tracking.', 'Modeled semester administration and supervisor request, token, and OTP verification flows.', 'Containerized the PostgreSQL development database with Docker Compose.'],
    technologies: ['React', 'Vite', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'JWT', 'PostgreSQL', 'Docker'], outcomes: ['Working public prototype', 'Role-aware internship workflows', 'Document and verification flows'],
    links: [
      { label: 'View Repository', href: 'https://github.com/htenlik/Internship-Workflow-Management-System', icon: '/icons/github.svg' },
      { label: 'Go to Live Demo', href: 'https://internship-workflow-management-syst.vercel.app/', icon: '/icons/globe.svg' },
    ],
    media: [
      { src: '/media/projects/internship-workflow/iwms-student-dashboard.jpg', alt: 'IWMS student dashboard and company registration entry point', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-report-workflow.jpg', alt: 'IWMS internship report workflow and internship information form', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-status-tracking.jpg', alt: 'IWMS report status tracking and lifecycle view', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/internship-workflow-preview.svg', alt: 'Internship workflow from applicant through completion', kind: 'diagram' },
    ],
  },
  {
    id: 'tasinmaz-management-system', title: 'Taşınmaz Yönetim Sistemi', subtitle: 'Full Stack / GIS', categories: ['Full Stack'], status: 'Public Project', featured: true,
    role: 'Full-stack development', summary: 'A full-stack real-estate management application combining an Angular frontend, an ASP.NET Core API, structured location data, authentication, logging, export features, and map-based property visualization.',
    challenge: 'Manage property and user data across a structured location hierarchy while supporting secure, searchable, map-oriented workflows.',
    contributions: ['Built the Angular 15 and TypeScript frontend with Bootstrap 5.', 'Implemented an ASP.NET Core Web API targeting .NET 8 with Entity Framework Core.', 'Added JWT authentication and a layered backend structure.', 'Modeled province, district, neighborhood, and property relationships.', 'Implemented user management, property CRUD, filtering, pagination, and action logging.', 'Added Excel export and OpenLayers map visualization.'],
    technologies: ['Angular 15', 'TypeScript', 'Bootstrap 5', 'ASP.NET Core Web API', '.NET 8', 'Entity Framework Core', 'JWT', 'OpenLayers'], outcomes: ['Location-aware property workflows', 'Authenticated CRUD and user administration', 'Logging, export, and map visualization'],
    links: [{ label: 'View Repository', href: 'https://github.com/htenlik/Tasinmaz-Management-System', icon: '/icons/github.svg' }],
    media: [{ src: '/media/projects/tasinmaz/tasinmaz-dashboard.png', alt: 'Property management dashboard with records, location filters, and map visualization', kind: 'visual' }],
  },
  {
    id: 'mpi-gather-torus', title: 'MPI Gather over Torus Topology', subtitle: 'Systems / Parallel Computing', categories: ['Systems'], status: 'Technical Case Study', featured: true,
    role: 'Systems design, simulation, and evaluation', summary: 'An OMNeT++ study comparing naive MPI_Gather with topology-aware hierarchical aggregation over a two-dimensional torus.',
    challenge: 'Reduce redundant network traffic and root-process pressure while gathering data from up to 256 processes connected by horizontal and vertical wrap-around links.',
    contributions: ['Modeled 4×4, 8×8, and 16×16 torus topologies in OMNeT++.', 'Implemented a naive direct-to-root baseline and a topology-aware row-then-column aggregation strategy.', 'Measured completion time, total hop transmissions, root packets, and per-link traffic.', 'Documented routing, synchronization, aggregation, and reproducible simulation parameters in a technical report.'],
    technologies: ['OMNeT++', 'MPI concepts', 'C++', 'Parallel computing', 'Network simulation', 'Process topologies'], outcomes: ['46.88% fewer hop transmissions at 16×16', '88.24% fewer packets delivered to the root at 16×16', 'Documented 7.04% completion-time trade-off from aggregation latency'],
    links: [
      { label: 'View Repository', href: 'https://github.com/htenlik/MPIGatherTorus/', icon: '/icons/github.svg' },
      { label: 'Open Technical Report', href: '/media/projects/mpi-torus/BBM442_Huseyin_Tenlik.pdf', icon: '/icons/document.svg' },
    ],
    media: [
      { src: '/media/projects/mpi-torus/mpi-torus-preview.svg', alt: 'Four by four torus topology with wrap-around links and highlighted root process', kind: 'diagram' },
      { src: '/media/projects/mpi-torus/BBM442_Huseyin_Tenlik.pdf', thumbnail: '/media/projects/mpi-torus/mpi-report-cover.png', alt: 'BBM442 technical report: MPI Gather on 2D Torus using OMNeT++', kind: 'document' },
    ],
  },
];

export const getProject = (id: Project['id']) => projects.find((project) => project.id === id);
