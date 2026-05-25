'use client';

import Link from 'next/link';

import { MagneticButton } from '@/components';
import { navItems } from '@/data';
import { randomId } from '@/utils';

export function NavbarList() {
  const items = navItems.slice(1).map(({ href, title }) => {
    const id = randomId();
    return (
      <li key={id} className='group relative p-4'>
        <Link href={href} passHref>
          <MagneticButton>
            <div className='relative flex flex-col items-center justify-center py-2'>
              <span className='text-base font-light lowercase'>{title}</span>
              <div className='absolute bottom-0 size-1.5 scale-0 rounded-full bg-current transition-transform duration-300 ease-in-expo group-hover:scale-100' />
            </div>
          </MagneticButton>
        </Link>
      </li>
    );
  });

  return <ul className='flex items-center max-lg:hidden'>{items}</ul>;
}
