'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { useLenis, useTimeOut } from '@/hooks';

import { Preloader } from './preloader';

let lastPathname = null;
let hasLoadedInitial = false;

function getRouteLabel(pathname) {
  if (pathname === '/') {
    return 'Home';
  }

  return pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ');
}

/** @param {import('react').PropsWithChildren<unknown>} */
export function Transition({ children }) {
  const [isLoading, setLoading] = useState(!hasLoadedInitial);
  const [isRouteChanging, setRouteChanging] = useState(false);
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useLenis();
  useTimeOut({
    callback: () => {
      hasLoadedInitial = true;
      setLoading(false);
      window.scrollTo(0, 0);
    },
    duration: 2000,
    deps: [],
  });

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;

      if (!lastPathname) {
        lastPathname = pathname;
        return undefined;
      }
    }

    if (lastPathname === pathname) {
      return undefined;
    }

    lastPathname = pathname;
    setRouteChanging(true);
    window.scrollTo(0, 0);

    const timeout = window.setTimeout(() => {
      setRouteChanging(false);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <div key={pathname} className='overflow-hidden'>
      <AnimatePresence mode='wait'>
        {isLoading ? <Preloader /> : null}
      </AnimatePresence>
      <AnimatePresence mode='wait'>
        {!isLoading && isRouteChanging ? (
          <motion.div
            className='fixed inset-0 z-40 flex items-center justify-center bg-foreground text-background'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.p
              className='text-[clamp(3rem,10vw,9rem)] font-light capitalize leading-none'
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
              {getRouteLabel(pathname)}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {children}
    </div>
  );
}
