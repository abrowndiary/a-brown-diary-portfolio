'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { useLenis, useTimeOut } from '@/hooks';

import { Preloader } from './preloader';

let hasLoadedInitial = false;

function getRouteLabel(pathname) {
  if (pathname === '/') return 'Home';
  return pathname
    .split('/')
    .filter(Boolean)
    .at(0)
    ?.replaceAll('-', ' ')
    .replace(/^\w/, character => character.toUpperCase());
}

/** @param {import('react').PropsWithChildren<unknown>} */
export function Transition({ children }) {
  const [isLoading, setLoading] = useState(!hasLoadedInitial);
  const [isRouteLoading, setRouteLoading] = useState(false);
  const pathname = usePathname();

  useLenis();
  useTimeOut({
    callback: () => {
      if (!isLoading) return;

      setLoading(false);
      hasLoadedInitial = true;
      window.scrollTo(0, 0);
    },
    duration: 2000,
    deps: [isLoading],
  });

  useEffect(() => {
    if (!hasLoadedInitial) return undefined;

    setRouteLoading(true);
    window.scrollTo(0, 0);

    const timeout = window.setTimeout(() => {
      setRouteLoading(false);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <div key={pathname} className='overflow-hidden'>
      <AnimatePresence mode='wait'>
        {isLoading ? <Preloader /> : null}
        {!isLoading && isRouteLoading ? (
          <motion.div
            key={`route-${pathname}`}
            className='fixed inset-0 z-50 grid place-items-center bg-foreground text-background'
            initial={{
              y: '100%',
              borderTopLeftRadius: '50%',
              borderTopRightRadius: '50%',
            }}
            animate={{
              y: 0,
              borderTopLeftRadius: '0%',
              borderTopRightRadius: '0%',
            }}
            exit={{
              y: '-100%',
              borderBottomLeftRadius: '50%',
              borderBottomRightRadius: '50%',
            }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className='flex items-center gap-4 text-3xl md:text-5xl'>
              <span className='size-2 md:size-3 rounded-full bg-background' />
              <span>{getRouteLabel(pathname)}</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {children}
    </div>
  );
}
