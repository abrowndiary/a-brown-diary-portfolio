'use client';

import Link from 'next/link';

import { socialMedias } from '@/data';
import { randomId } from '@/utils';

export function OffcanvasFooter() {
  const medias = socialMedias.map(({ href, title }) => {
    const id = randomId();
    return (
      <li key={id}>
        <Link
          href={href}
          target='_blank'
          rel='noopener'
          className='group relative inline-flex py-2 text-base text-background'
        >
          <span>{title}</span>
          <span className='absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-background transition-transform duration-300 group-hover:scale-x-100' />
        </Link>
      </li>
    );
  });

  return (
    <div>
      <p className='text-background/55 mb-3 text-xs uppercase tracking-[0.08em]'>
        Socials
      </p>
      <ul className='flex w-full flex-wrap gap-8'>{medias}</ul>
    </div>
  );
}
