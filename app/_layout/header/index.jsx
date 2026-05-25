'use client';

import { motion } from 'framer-motion';
import { MoveDownRight } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

import { ParallaxSlider } from '@/components';

import { slideUp } from './variants';

export function Header() {
  return (
    <motion.header
      className='relative h-screen overflow-hidden bg-secondary-foreground text-background'
      variants={slideUp}
      initial='initial'
      animate='enter'
    >
      <CldImage
        src='Dennis-Portfolio/images/lapetmmek4fymz68m4u8'
        className='object-cover md:scale-125 md:object-contain'
        fill={true}
        sizes='100vw'
        alt='Dennis Snellenberg Personal Picture'
      />

      {/* Located in Germany Globe Badge */}
      <div className='hanger-container hidden md:block'>
        <div className='hanger'>
          <p className='hanger-text'>
            <span>Located</span>
            <span>in</span>
            <span>Germany</span>
          </p>
          <svg
            width='300px'
            height='120px'
            viewBox='0 0 300 120'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <g fill='#1C1D20'>
                <path d='M239.633657,0 C272.770742,1.0182436e-15 299.633657,26.862915 299.633657,60 C299.633657,93.137085 272.770742,120 239.633657,120 L0,120 L0,0 L239.633657,0 Z M239.633657,18.7755102 C216.866,18.7755102 198.409167,37.232343 198.409167,60 C198.409167,82.767657 216.866,101.22449 239.633657,101.22449 C262.401314,101.22449 280.858147,82.767657 280.858147,60 C280.858147,37.232343 262.401314,18.7755102 239.633657,18.7755102 Z'></path>
              </g>
            </g>
          </svg>
          <div className='digital-ball'>
            <div className='globe-element'>
              <div className='globe-wrap-element'>
                <div className='circle-element'></div>
                <div className='circle-element'></div>
                <div className='circle-element'></div>
                <div className='circle-hor-element'></div>
                <div className='circle-hor-middle-element'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='relative flex h-full flex-col justify-end gap-2 md:flex-col-reverse md:justify-normal'>
        <div className='select-none'>
          <h1 className='text-[max(9em,15vw)]'>
            <ParallaxSlider repeat={4} baseVelocity={2}>
              <span className='pe-12'>
                A Brown Diary
                <span className='spacer'>—</span>
              </span>
            </ParallaxSlider>
          </h1>
        </div>

        <div className='md:ml-auto'>
          <div className='mx-10 max-md:my-12 md:mx-36'>
            <div className='mb-4 md:mb-20'>
              <MoveDownRight size={28} strokeWidth={1.25} />
            </div>

            <h4 className='text-[clamp(1.55em,2.5vw,2.75em)]'>
              <span className='block'>Tech</span>
              <span className='block'>Business &amp; Life in Germany</span>
            </h4>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
