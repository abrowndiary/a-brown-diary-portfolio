import content from './site-content.json';

export const siteContent = content;

export function getProjectBySlug(slug) {
  return siteContent.projects.find(project => project.slug === slug);
}
