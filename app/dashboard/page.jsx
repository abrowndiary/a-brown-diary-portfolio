import { siteContent } from '@/content';

import { DashboardClient } from './DashboardClient';

export const metadata = {
  title: 'Owner dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient initialContent={siteContent} />;
}
