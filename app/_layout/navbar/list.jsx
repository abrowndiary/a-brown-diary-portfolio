'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MagneticButton } from '@/components';
import { navItems } from '@/data';
import { randomId } from '@/utils';

export function NavbarList() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(null);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const items = navItems.slice(1).map(({ href, title }) => {
    const id = randomId();
    const isActive =
      activePath === href ||
      (href !== '/' && activePath?.startsWith(`${href}/`));

    return (
      <li key={id} className='group relative p-4'>
        <Link href={href} passHref>
          <MagneticButton>
            <span className='text-base capitalize'>{title}</span>
          </MagneticButton>
        </Link>
        <span
          className={`size-1.5 pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-current transition-transform duration-200 ease-in-expo ${
            isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'
          }`}
        />
      </li>
    );
  });

  return <ul className='flex items-center max-lg:hidden'>{items}</ul>;
}
