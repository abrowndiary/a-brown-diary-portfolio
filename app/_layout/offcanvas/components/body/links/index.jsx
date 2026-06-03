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
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const items = navItems.map(({ href, title }, index) => {
    const id = index;
    const isActive = (selectedLink ?? activeLink) === href;

    return (
      <motion.li
        key={id}
        className='relative my-4 flex items-center'
        variants={slideOut}
        custom={id}
        initial='initial'
        animate='enter'
        exit='exit'
        onMouseEnter={() => setSelectedLink(href)}
      >
        <motion.div
          className='size-2.5 absolute left-[-24px] top-1/2 -translate-y-1/2 rounded-full bg-background'
          variants={scale}
          initial='closed'
          animate={isActive ? 'open' : 'closed'}
        />
        <div
          className={`transition-transform duration-300 ease-out ${
            isActive ? 'translate-x-[12px]' : 'translate-x-0'
          }`}
        >
          <Link
            href={href}
            className='text-[clamp(2.5rem,5.5vw,4.5rem)] font-light capitalize leading-[1.4] text-background'
          >
            {title}
          </Link>
        </div>
      </motion.li>
    );
  });

  return (
    <div className='flex flex-col gap-3'>
      <div className='mb-12 border-b border-solid border-background/60 pb-2'>
        <h5 className='text-xs uppercase tracking-[0.08em] text-background/70'>
          Navigation
        </h5>
      </div>
      <ul onMouseLeave={() => setSelectedLink(null)}>{items}</ul>
    </div>
  );
}
