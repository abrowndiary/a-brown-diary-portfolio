'use client';

import { usePathname } from 'next/navigation';

import { NavbarBrand } from './brand';
import { NavbarList } from './list';

export function Navbar() {
  const pathname = usePathname();
  const isDarkHero = pathname === '/';

  return (
    <nav className='absolute inset-x-0 top-0 z-10'>
      <div
        className={`flex items-center justify-between px-8 py-4 ${
          isDarkHero ? 'text-background' : 'text-foreground'
        }`}
      >
        <NavbarBrand />
        <NavbarList />
      </div>
    </nav>
  );
}
