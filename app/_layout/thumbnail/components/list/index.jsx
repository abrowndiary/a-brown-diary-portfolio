'use client';

import Link from 'next/link';

import { thumbnailOptions } from '@/data';

/**
 * @param {Object} props
 * @param {(index: number) => void} props.handlePointerEnter
 * @param {(index: number) => void} props.handlePointerLeave
 * @param {(x: number, y: number) => void} props.moveItems
 */
export function ThumbnailList({
  handlePointerEnter,
  handlePointerLeave,
  moveItems,
}) {
  const items = thumbnailOptions.map(({ href, title, services }, index) => {
    const id = index;
    return (
      <li
        key={`thumbnail-list-${id}`}
        className='work-list-item border-t border-solid transition-all duration-300 last-of-type:border-b hover:!opacity-100 group-hover/list:opacity-30'
        style={{
          paddingInline: 'calc(clamp(1em,3vw,4em) * 2)',
          paddingBlock: 'clamp(1em,3vw,4em)',
        }}
        onPointerEnter={({ clientX, clientY }) => {
          handlePointerEnter(id);
          moveItems(clientX, clientY);
        }}
        onPointerLeave={({ clientX, clientY }) => {
          handlePointerLeave(id);
          moveItems(clientX, clientY);
        }}
      >
        <Link
          href={href}
          className='flex items-center justify-between max-lg:flex-wrap'
          passHref
        >
          <h4
            className='transition-transform duration-300'
            style={{
              fontSize: 'calc(clamp(3.25em, 7vw, 8em) * 0.75)',
            }}
          >
            {title}
          </h4>
          <p className='text-lg font-medium transition-transform duration-300'>
            {services}
          </p>
        </Link>
      </li>
    );
  });

  return <ul className='group/list'>{items}</ul>;
}
