export interface ExperienceEntry { organization: string; role: string; year?: string; context?: string; contributions: readonly string[]; technologies?: readonly string[]; note?: string }

export const experience: readonly ExperienceEntry[] = [
  {
    organization: 'Jotform', role: 'Backend Developer Intern', year: '2026',
    context: 'A three-person internship team building analytics capabilities for electronic signing workflows.',
    contributions: [
      'Implemented backend analytics behavior across session and event flows.', 'Added date, country, and status filters before aggregation.',
      'Helped establish consistent session semantics across analytics endpoints.', 'Added engagement metrics such as unique users, total sessions, interaction rate, bounce rate, and read rate.',
      'Developed a field-friction model using a 0–100 score, confidence, and explainable signals.', 'Converted technical AI-generated metrics into clearer user-facing insights and health assessments.',
      'Added useful enrichment such as document titles and signer email handling where available.', 'Worked with the team to prepare and present the project in the internship demo.',
    ],
    technologies: ['PHP', 'Backend APIs', 'Analytics', 'Data aggregation', 'AI-assisted reporting'],
    note: 'Private source code, internal endpoints, customer information, and company-only visuals are intentionally not shown.',
  },
  {
    organization: 'OdakGIS', role: 'Full Stack Developer',
    contributions: ['Worked on full-stack web applications.', 'Built and maintained application functionality using .NET and Angular.', 'Worked with geospatial interfaces and GIS technologies.', 'Used tools such as OpenLayers and GeoServer.', 'Contributed to production-oriented and government-supported application workflows.'],
    technologies: ['C#', '.NET', 'Angular', 'OpenLayers', 'GeoServer', 'GIS'],
  },
  {
    organization: 'TÜBİTAK', role: 'Research Scholarship Holder',
    contributions: ['Contributed to software and research infrastructure in a funded research context.', 'Worked with technical problem solving and implementation-oriented research tasks.'],
  },
];
