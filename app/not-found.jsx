import Link from 'next/link';

import { siteContent } from '@/content';

export const metadata = {
  title: `Not found | ${siteContent.site.name}`,
  description: siteContent.site.metaDescription,
};

export default function NotFound() {
  return (
    <main className='grid min-h-screen place-items-center bg-background p-8 text-center text-foreground'>
      <div>
        <p className='mb-6 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
          404
        </p>
        <h1 className='text-[clamp(3rem,8vw,8rem)] font-light leading-none'>
          Page not found
        </h1>
        <Link className='mt-8 inline-flex underline' href='/'>
          Return home
        </Link>
      </div>
    </main>
  );
}
