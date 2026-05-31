'use client';

import { forwardRef } from 'react';

import { motion } from 'framer-motion';

import { Center } from '@/components';
import { thumbnailOptions } from '@/data';
import { randomId } from '@/utils';

const MotionComponent = motion(Center);

export const ThumbnailModal = forwardRef(
  /**
   * @param {import('react').HTMLAttributes<HTMLElement> & { variants: import('framer-motion').Variants; active: boolean; index: number;}} props
   * @param {import('react').ForwardedRef<HTMLElement>} ref
   */
  function ThumbnailModal({ variants, active, index, ...props }, ref) {
    const items = thumbnailOptions.map(({ title, image, category }) => {
      const id = randomId();
      return (
        <Center key={id} className='h-full w-full'>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              width={320}
              height={320}
              alt={`${title} thumbnail image`}
            />
          ) : (
            <div className='size-full grid place-items-center bg-[linear-gradient(135deg,#1c1d20,#4c4f56_55%,#c8c4b8)] p-8 text-center text-background'>
              <div>
                <p className='text-xs uppercase tracking-[0.18em] text-background/60'>
                  {category}
                </p>
                <p className='mt-4 text-4xl font-light leading-none'>{title}</p>
              </div>
            </div>
          )}
        </Center>
      );
    });

    return (
      <MotionComponent
        ref={ref}
        className='pointer-events-none fixed left-1/2 top-1/2 h-80 w-80 overflow-hidden rounded bg-secondary-foreground'
        variants={variants}
        initial='initial'
        animate={active ? 'enter' : 'closed'}
        {...props}
      >
        <div
          className='relative h-full w-full'
          style={{
            top: `${index * -100}%`,
            transition: 'top 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        >
          {items}
        </div>
      </MotionComponent>
    );
  },
);
