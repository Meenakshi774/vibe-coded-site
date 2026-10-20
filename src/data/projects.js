// All projects live here. The home page shows the ones marked `featured: true`;
// the Projects page shows all of them, in this order.
//
// Fields:
//   title       — project name
//   description — one or two sentences
//   category    — must match one of `projectCategories` below (used for filtering)
//   year        — optional; use '' to hide it
//   href        — where the card links (PLACEHOLDER example.com URLs for now)
//   featured    — true to show on the home page

export const projectCategories = ['Business', 'Writing', 'Experiments'];

export const projects = [
  {
    title: 'Project One',
    description: 'A short description of a project, experiment, or business.',
    category: 'Business',
    year: '20XX',
    href: 'https://example.com/project-one',
    featured: true,
  },
  {
    title: 'Project Two',
    description: 'A short description of something built or launched.',
    category: 'Writing',
    year: '20XX',
    href: 'https://example.com/project-two',
    featured: true,
  },
  {
    title: 'Project Three',
    description: 'A short description of an interesting initiative or experiment.',
    category: 'Experiments',
    year: '20XX',
    href: 'https://example.com/project-three',
    featured: true,
  },
  {
    title: 'Project Four',
    description: 'A short description of a side project and what it set out to do.',
    category: 'Business',
    year: '20XX',
    href: 'https://example.com/project-four',
    featured: false,
  },
  {
    title: 'Project Five',
    description: 'A short description of a piece of writing, series, or publication.',
    category: 'Writing',
    year: '20XX',
    href: 'https://example.com/project-five',
    featured: false,
  },
  {
    title: 'Project Six',
    description: 'A short description of a small experiment and what came of it.',
    category: 'Experiments',
    year: '20XX',
    href: 'https://example.com/project-six',
    featured: false,
  },
];
