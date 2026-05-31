import { siteContent } from '@/content';

/** @type {import('next').Metadata} */
export const rootMetadata = {
  metadataBase: new URL('https://abrowndiary.com/'),
  title: {
    template: `%s | ${siteContent.site.name}`,
    default: `${siteContent.site.name} | ${siteContent.site.tagline}`,
  },
  description: siteContent.site.metaDescription,
  generator: 'Next.js',
  applicationName: siteContent.site.name,
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Physical AI',
    'Cybersecurity',
    'Automation',
    'Digital transformation',
    'Germany',
    'Business',
  ],
  authors: [{ name: siteContent.site.owner }],
  creator: siteContent.site.owner,
  publisher: siteContent.site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
