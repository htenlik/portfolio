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
      { src: '/media/projects/jotform/jotform-01-overview.webp', alt: 'Sign Insights overview with completion totals and timing ranges', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-02-signing-trends.webp', alt: 'Signing trends and reasons for incomplete sessions', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-03-signing-sessions.webp', alt: 'Searchable signing-session table with status and timing details', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-04-audience-breakdown.webp', alt: 'Device, browser, operating-system, and country breakdowns', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-05-field-overview.webp', alt: 'Field Analysis overview with tracked events and friction totals', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-06-field-sessions.webp', alt: 'Per-field session counts and effort-level table', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-07-recent-engagement.webp', alt: 'Recent signer engagement table with important activity summaries', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-08-ai-overview.webp', alt: 'AI Insights overview with engagement trend and health metrics', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-09-ai-actions.webp', alt: 'Prioritized AI actions with confidence and friction labels', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-10-ai-analysis.webp', alt: 'Expanded AI analysis with observed signals and watchouts', kind: 'screenshot' },
      { src: '/media/projects/jotform/jotform-11-field-detail.webp', alt: 'Focused field-session chart and field-type reference table', kind: 'screenshot' },
    ],
  },
  {
    id: 'internship-workflow-management', title: 'Internship Workflow Management System', subtitle: 'Full Stack / Workflow', categories: ['Full Stack'], status: 'Public Full-stack Prototype', year: '2026', featured: true,
    role: 'Full-stack engineer across workflow design, frontend, backend, database, and automated tests', summary: 'A role-based internship management prototype for Hacettepe University Computer Engineering. It connects students, coordinators, administrators, companies, and supervisors across report submission, verification, certification, and assessment.',
    challenge: 'Replace disconnected forms and manual follow-up with one traceable workflow while enforcing role permissions, document rules, company-domain checks, semester constraints, and secure one-time supervisor access.',
    contributions: [
      'Built React and Vite interfaces for Student, Coordinator, Admin, and external Supervisor workflows with protected, role-aware navigation.',
      'Implemented Spring Boot REST services with Spring Data JPA, Spring Security, JWT authentication, validation, and centralized API error handling.',
      'Developed the internship-report lifecycle: draft creation, multi-step editing, attendance and duration checks, PDF upload, submission, status history, and final assessment.',
      'Implemented public company registration, corporate-domain validation, duplicate handling, and administrator approval or rejection with reviewer trace data.',
      'Created supervisor request, approval, token and OTP verification, retry lockout, one-time access, certification, and expiry flows.',
      'Added semester management with overlap validation and active-student ID review for malformed or invalid entries.',
      'Implemented FAQ and announcement publishing plus user-management and company-review administration screens.',
      'Containerized PostgreSQL for local development and configured the frontend and backend for independent public deployment.',
      'Covered core use cases with Spring Boot tests, frontend component tests, and Playwright end-to-end flows.',
    ],
    technologies: ['React', 'Vite', 'Axios', 'React Router', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'JWT', 'PostgreSQL', 'Docker Compose', 'JUnit', 'Vitest', 'Playwright'], outcomes: ['End-to-end report, supervisor certification, and assessment lifecycle', 'Separate permissions and navigation for four user roles', 'Validated company, semester, document, token, and OTP workflows', 'Publicly accessible frontend and backend demo', 'Automated coverage for demo-critical use cases'],
    links: [
      { label: 'View Repository', href: 'https://github.com/htenlik/Internship-Workflow-Management-System', icon: '/icons/github.svg' },
      { label: 'Go to Live Demo', href: 'https://internship-workflow-management-syst.vercel.app/', icon: '/icons/globe.svg' },
    ],
    media: [
      { src: '/media/projects/internship-workflow/iwms-01-login.webp', alt: 'IWMS role-based login and public entry points', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-02-student-dashboard.webp', alt: 'Student dashboard with company, report, supervisor, announcement, and FAQ modules', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-03-report-workflow.webp', alt: 'Multi-step internship report editor with saved drafts', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-04-status-tracking.webp', alt: 'Internship status, certification, assessment, and lifecycle tracking', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-05-company-registration.webp', alt: 'Public company registration and administrator review workflow', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-06-supervisor-access.webp', alt: 'One-time supervisor token, verification, and certification portal', kind: 'screenshot' },
      { src: '/media/projects/internship-workflow/iwms-07-faq-announcements.webp', alt: 'Published internship announcements and frequently asked questions', kind: 'screenshot' },
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
      { src: '/media/projects/mpi-torus/BBM442_Huseyin_Tenlik.pdf', thumbnail: '/media/projects/mpi-torus/mpi-report-cover.png', alt: 'BBM442 technical report: MPI Gather on 2D Torus using OMNeT++', kind: 'document' },
      { src: '/media/projects/mpi-torus/mpi-torus-preview.svg', alt: 'Four by four torus topology with wrap-around links and highlighted root process', kind: 'diagram' },
    ],
  },
];

export const getProject = (id: Project['id']) => projects.find((project) => project.id === id);
