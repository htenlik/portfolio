export const profile = {
  name: 'Hüseyin Tenlik',
  headline: 'Software Engineer',
  location: 'Ankara, Türkiye',
  education: 'B.Sc. in Computer Engineering, Hacettepe University',
  educationDetails: [
    { label: 'Study period', value: 'Aug. 2023 – Expected Jun. 2027' },
    { label: 'GPA', value: '3.21 / 4.00' },
    { label: '2023 YKS', value: 'Quantitative rank: 2,002 of 1.5 million (top 0.13%)' },
  ],
  summary: 'Hüseyin is a Computer Engineering student at Hacettepe University and a part-time engineer at ASELSAN, where his expected focus is software testing. His experience spans backend and full-stack development, signing analytics, municipal GIS workflows, software quality research, database internals, and generative AI evaluation.',
  languages: ['Turkish — Native', 'English — Upper-intermediate', 'French — Beginner'],
  links: [
    { label: 'GitHub', value: 'github.com/htenlik', href: 'https://github.com/htenlik' },
  ],
  technologies: {
    Backend: ['Java', 'Spring Boot', 'Spring Data JPA', 'C#', 'ASP.NET Core', 'PHP', 'Python'],
    Frontend: ['React', 'Angular', 'TypeScript', 'JavaScript'],
    'Data and infrastructure': ['PostgreSQL', 'PostGIS', 'MySQL', 'Flyway', 'REST APIs', 'Git', 'Docker'],
    Systems: ['C++20', 'OMNeT++', 'MPI concepts', 'Database internals', 'WAL and crash recovery'],
    'Testing and quality': ['Unit and contract testing', 'OpenAPI', 'Playwright', 'CTest', 'AI evaluation'],
    Specialized: ['OpenLayers', 'GeoServer', 'DSL parsing', 'Kotlin', 'Jetpack Compose'],
  },
} as const;
