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
    const isActive = activePath === href;

    return (
      <li key={id} className='group p-4'>
        <Link href={href} className='relative' passHref>
          <MagneticButton>
            <span className='text-base capitalize'>{title}</span>
            <span
              className={`size-1.5 absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-full bg-background transition-transform duration-300 ease-in-expo ${
                isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'
              }`}
            />
          </MagneticButton>
        </Link>
      </li>
    );
  });

  return <ul className='flex items-center max-lg:hidden'>{items}</ul>;
}
