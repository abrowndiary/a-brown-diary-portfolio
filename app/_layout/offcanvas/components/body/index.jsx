'use client';

import { motion } from 'framer-motion';

import { FixedOverlay } from '@/components';

import { OffcanvasFooter } from './footer';
import { OffcanvasLinks } from './links';
import { slideLeft } from './variants';

const MotionComponent = motion(FixedOverlay);

export function OffcanvasBody() {
  return (
    <MotionComponent
      className='z-40'
      variants={slideLeft}
      initial='initial'
      animate='enter'
      exit='exit'
    >
      <div className='absolute inset-0 bg-foreground text-background lg:left-auto lg:w-[min(72rem,100vw)]'>
        <div className='flex h-full flex-col justify-between px-8 py-28 sm:px-16 lg:px-28'>
          <OffcanvasLinks />
          <OffcanvasFooter />
        </div>
      </div>
    </MotionComponent>
  );
}
