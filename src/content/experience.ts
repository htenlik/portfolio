export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  dates: string;
  context?: string;
  contributions: readonly string[];
  technologies?: readonly string[];
}

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'odakgis',
    organization: 'OdakGIS',
    role: 'Part-time Full Stack Web Developer',
    dates: 'Apr. 2025 – Oct. 2025',
    context: 'Worked on government-supported web-based geographic information system applications.',
    contributions: [
      'Developed frontend modules, REST APIs, and database schemas with Angular, .NET, PostgreSQL, OpenLayers, and GeoServer.',
      'Contributed to data management, debugging, and workflow improvements across GIS applications.',
      'Implemented map and image upload, visualization, and location-oriented interface features.',
      'Owned modules from implementation through deployment support.',
    ],
    technologies: ['Angular', '.NET', 'PostgreSQL', 'OpenLayers', 'GeoServer', 'GIS'],
  },
  {
    id: 'tubitak-dream',
    organization: 'TÜBİTAK 1001 ARDEB & Hacettepe DREAM Project',
    role: 'Scholarship Holder · Supervisor: Prof. Dr. Ayça Kolukısa Tarhan',
    dates: 'Oct. 2025 – Jun. 2026',
    context: 'Research work at Hacettepe University focused on domain-specific modeling and open-source software quality assessment.',
    contributions: [
      'Owned the primary web application across a React frontend, Spring Boot backend, PostgreSQL database, and Docker development environment.',
      'Developed backend services for DSL-based modeling infrastructure and persistence.',
      'Implemented consistency checks and model-integrity controls for research workflows.',
    ],
    technologies: ['React', 'Spring Boot', 'PostgreSQL', 'Docker', 'DSL modeling'],
  },
  {
    id: 'jotform',
    organization: 'Jotform',
    role: 'Backend Developer Intern',
    dates: 'Jun. 2026 – Aug. 2026',
    context: 'Worked in a three-person team on a PHP-based Sign Analytics and AI Insights product.',
    contributions: [
      'Built REST APIs and aggregation pipelines for filters, field analytics, event activity, daily signing and engagement trends, document metadata, and signer sessions.',
      'Developed field-friction scoring and AI-assisted insight and health assessments.',
      'Documented APIs with OpenAPI and used privacy-aware metadata handling.',
      'Added contract tests and helped prepare the product demo.',
    ],
    technologies: ['PHP', 'REST APIs', 'Analytics', 'OpenAPI', 'Contract testing'],
  },
  {
    id: 'vakifbank',
    organization: 'VakıfBank',
    role: 'Backend Developer Intern',
    dates: 'Aug. 2026 – Present',
    contributions: [],
  },
];

export const training: readonly ExperienceEntry[] = [
  {
    id: 'inzva-camp',
    organization: 'Algorithm Winter & Summer Camp 2025',
    role: 'inzva · Istanbul',
    dates: '2025',
    contributions: [
      'Selected as one of 50 participants from more than 300 applicants.',
      'Studied advanced dynamic programming, graphs, and trees.',
      'Solved more than 50 Algoleague problems and competed in an ICPC-style contest.',
    ],
  },
  {
    id: 'teknofest-trendyol',
    organization: 'TEKNOFEST 2025 – Trendyol E-Commerce Hackathon',
    role: 'Top 20 Finalist',
    dates: '2025',
    contributions: [
      'Reached the Top 20 among 302 teams and 1,181 participants.',
      'Worked on e-commerce feature engineering, model training, click-through-rate, and conversion prediction.',
    ],
  },
];
