'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/data';

import { scale, slideOut } from './variants';

export function OffcanvasLinks() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const items = navItems.map(({ href, title }, index) => {
    const id = index;
    const isActive = activeLink === href;

    return (
      <motion.li
        key={id}
        className='relative my-4 flex items-center'
        variants={slideOut}
        custom={id}
        initial='initial'
        animate='enter'
        exit='exit'
        onPointerEnter={() => setActiveLink(href)}
      >
        <motion.div
          className='absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-background'
          variants={scale}
          initial='closed'
          animate={isActive ? 'open' : 'closed'}
        />
        <motion.div
          animate={{ x: isActive ? 30 : 0 }}
          transition={{
            type: 'tween',
            ease: [0.76, 0, 0.24, 1],
            duration: 0.3,
          }}
        >
          <Link
            href={href}
            className='text-[clamp(2.5rem,5.5vw,4.5rem)] font-light capitalize leading-[1.4] text-background'
          >
            {title}
          </Link>
        </motion.div>
      </motion.li>
    );
  });

  return (
    <div className='mt-20 flex flex-col gap-3'>
      <div className='mb-10 border-b border-solid'>
        <h5 className='text-xs uppercase text-secondary-foreground'>
          Navigation
        </h5>
      </div>
      <ul onPointerLeave={() => setActiveLink(pathname)}>{items}</ul>
    </div>
  );
}
