'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { useLenis, useTimeOut } from '@/hooks';

import { Preloader } from './preloader';

let hasLoadedInitial = false;

/** @param {import('react').PropsWithChildren<unknown>} */
export function Transition({ children }) {
  const [isLoading, setLoading] = useState(!hasLoadedInitial);
  const pathname = usePathname();

  useLenis();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

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

  return (
    <div className='overflow-hidden'>
      <AnimatePresence mode='wait'>
        {isLoading ? <Preloader /> : null}
      </AnimatePresence>
      {children}
    </div>
  );
}
