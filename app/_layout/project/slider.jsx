'use client';

import { Center } from '@/components';

/**
 * @param {Object} props
 * @param {'image' | 'video' | 'placeholder'} props.type
 * @param {string} [props.source]
 * @param {string} [props.label]
 */
export function ProjectSlider({ type, source, label }) {
  const image =
    type === 'image' && source ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={source}
        className='size-full absolute inset-0 object-cover'
        alt={label || 'project media'}
      />
    ) : null;
  const video =
    type === 'video' && source ? (
      <video
        src={source}
        loop={true}
        controls={false}
        muted={true}
        autoPlay={true}
        playsInline={true}
        className='size-full absolute inset-0 object-cover'
      />
    ) : null;
  const placeholder =
    type === 'placeholder' || (!image && !video) ? (
      <div className='absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#1c1d20,#3d3f45_45%,#c8c4b8)] p-6 text-center text-background'>
        <span className='text-[clamp(1.25rem,2.4vw,2.75rem)] font-light leading-none'>
          {label || 'Media'}
        </span>
      </div>
    ) : null;

  return (
    <Center
      className='relative w-1/4 overflow-hidden rounded'
      style={{
        minWidth: '150px',
        height: '20vw',
      }}
    >
      {image}
      {video}
      {placeholder}
    </Center>
  );
}
