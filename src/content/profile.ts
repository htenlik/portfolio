export const profile = {
  name: 'Hüseyin Tenlik',
  headline: 'Software Engineer',
  location: 'Ankara, Türkiye',
  education: 'Senior Computer Engineering student at Hacettepe University',
  summary: 'Hüseyin is a software engineer focused on backend systems, full-stack product development, and practical engineering. His work spans analytics systems, geospatial applications, database internals, distributed computing, and production-oriented web development.',
  links: [
    { label: 'GitHub', value: 'github.com/htenlik', href: 'https://github.com/htenlik' },
  ],
  technologies: {
    Backend: ['Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Python'],
    Frontend: ['React', 'Angular', 'TypeScript', 'JavaScript'],
    'Data and infrastructure': ['PostgreSQL', 'MySQL', 'REST APIs', 'Git', 'Docker'],
    Systems: ['C++', 'MPI', 'Distributed systems', 'Database internals'],
    Specialized: ['OpenLayers', 'GeoServer', 'Kotlin', 'Jetpack Compose'],
  },
} as const;
