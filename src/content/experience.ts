export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  dates?: string;
  context?: string;
  contributions: readonly string[];
  technologies?: readonly string[];
}

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'aselsan',
    organization: 'ASELSAN',
    role: 'Part-time Engineer',
    dates: 'Nov. 2026 – Present',
    context: 'Newly joined a part-time engineering role in Ankara, Türkiye, with an expected focus on software testing.',
    contributions: [],
  },
  {
    id: 'jotform',
    organization: 'Jotform',
    role: 'Backend Developer Intern',
    dates: 'Jun. 2026 – Aug. 2026',
    context: 'Built Sign Insights, an analytics MVP for Jotform Sign, in a three-intern team.',
    contributions: [
      'Built the PHP backend and reconstructed signing sessions with document/session composite keys to prevent cross-document session collisions.',
      'Kept dashboard summaries, engagement trends, field analytics, and session views consistent under shared filters; derived session status from complete event histories to avoid date-filter misclassification.',
      'Implemented field-friction scoring and converted sanitized AI reports into readable summaries; maintained unit and contract tests, OpenAPI documentation, and authorized access to signer metadata.',
      'Took on JavaScript frontend integration in the final two weeks, connecting Overview, Fields, and AI Insights for a working end-to-end MVP demo.',
    ],
    technologies: ['PHP', 'JavaScript', 'REST APIs', 'Analytics', 'OpenAPI', 'Unit and contract testing'],
  },
  {
    id: 'tubitak-dream',
    organization: 'Hacettepe University – TÜBİTAK ARDEB 1001 (DREAM)',
    role: 'Research Scholar & Software Developer',
    dates: 'Oct. 2025 – Jun. 2026',
    context: 'Selected for a research scholarship in domain-specific modeling and open-source software quality assessment. Developed OSS-QMET with one other undergraduate, supervised by Prof. Dr. Ayça Kolukısa.',
    contributions: [
      'Built model and data management, visualization workflows, a visual quality-model editor, and a DSL parser with Java/Spring Boot, React, and PostgreSQL.',
      'Implemented nested quality-model persistence with Spring Data JPA and versioned schema changes with Flyway.',
      'Added Docker packaging, unit tests, and Playwright end-to-end tests.',
    ],
    technologies: ['Java', 'Spring Boot', 'Spring Data JPA', 'React', 'PostgreSQL', 'Flyway', 'Docker', 'DSL parsing', 'Playwright'],
  },
  {
    id: 'odakgis',
    organization: 'OdakGIS',
    role: 'Part-time Full Stack Web Developer',
    dates: 'Mar. 2025 – Oct. 2025',
    context: 'Core contributor to municipal zoning, building-permit, and geographic information system applications.',
    contributions: [
      'Helped build Yedikule E-Imar from scratch, digitizing paper-based zoning and building-permit workflows for contractors, engineers, and municipal staff with C#/ASP.NET Core 8, Angular, and PostgreSQL/PostGIS.',
      'Presented the application on-site at Kırşehir Municipality and helped correct approval/signing flows, staff handoffs, editing permissions, UI validations, and API checks.',
      'Extended OdakMAP, the shared OpenLayers/GeoServer foundation for finance and utility products; built map queries and helped migrate the platform and downstream applications from Angular 7 to 15.',
      'Restored large permit-document submission by adjusting server limits, streaming uploads, and adding frontend retries.',
      'Built UI, REST API, and database support for attaching photos and albums to map-selected graves in MBS, used by Istanbul Metropolitan Municipality and other municipalities.',
    ],
    technologies: ['Angular', 'C#', 'ASP.NET Core 8', 'PostgreSQL', 'PostGIS', 'OpenLayers', 'GeoServer', 'GIS'],
  },
  {
    id: 'outlier',
    organization: 'Outlier',
    role: 'Generative AI Evaluation · Project-based contract',
    contributions: [
      'Designed multi-turn scenarios and evaluation rubrics for coding, reasoning, research, and multimodal tasks.',
      'Compared model outputs and documented failures in correctness, instruction following, tool use, and reliability.',
    ],
  },
];

export const training: readonly ExperienceEntry[] = [
  {
    id: 'kampplus-android',
    organization: 'GSB & Turkcell Kamp+ Android Tech Camp',
    role: 'Mobile Application Development Program',
    dates: 'Sep. 2026',
    contributions: [
      'Extended the camp\'s Kotlin and Jetpack Compose reference weather application into Hava 1.1.0.',
      'Added offline caching, device location, persistent settings, localization, adaptive UI, and accessibility improvements.',
      'Set up CI-backed testing with 60 unit tests.',
    ],
    technologies: ['Kotlin', 'Jetpack Compose', 'Room', 'Hilt', 'CI'],
  },
  {
    id: 'inzva-camp',
    organization: 'Algorithm Winter & Summer Camp 2025',
    role: 'inzva · Istanbul',
    dates: '2025',
    contributions: [
      'Selected as one of 50 participants from more than 400 applicants.',
      'Studied advanced dynamic programming, graphs, and trees.',
      'Solved more than 100 problems, mainly in C++, and competed in an ICPC-style contest.',
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
