'use client';

import { useEffect, useState } from 'react';

import { Dot } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Center, MagneticButton } from '@/components';
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
        <Link href={href} passHref>
          <MagneticButton>
            <span className='text-base capitalize'>{title}</span>
            <Center>
              <Dot
                className={`transition-transform duration-200 ease-in-expo ${
                  isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'
                }`}
              />
            </Center>
          </MagneticButton>
        </Link>
      </li>
    );
  });

  return <ul className='flex items-center max-lg:hidden'>{items}</ul>;
}
