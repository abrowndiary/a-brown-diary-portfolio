'use client';

import Link from 'next/link';

import { siteContent } from '@/content';

export function NavbarBrand() {
  return (
    <Link href='/' className='group flex cursor-pointer items-center pb-5'>
      <span className='text-base font-light leading-none transition-transform duration-500 ease-in-expo group-hover:rotate-[360deg]'>
        (c)
      </span>

      <div className='relative ms-2 flex overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-expo group-hover:pe-28'>
        <div className='flex transition-transform duration-500 ease-in-expo group-hover:-translate-x-full'>
          <span className='text-base font-light leading-none'>Coded by</span>
          <span className='ps-1 text-base font-light leading-none'>
            {siteContent.site.owner}
          </span>
        </div>
        <div className='absolute left-0 flex translate-x-[150%] transition-transform duration-500 ease-in-expo group-hover:translate-x-0'>
          <span className='text-base font-light leading-none'>
            {siteContent.site.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
