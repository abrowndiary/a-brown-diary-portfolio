import { siteContent } from '@/content';

export const thumbnailOptions = siteContent.projects.map(project => ({
  href: `/work/${project.slug}`,
  title: project.title,
  image: project.media?.[0]?.src ?? '',
  services: project.services,
  category: project.category,
}));
