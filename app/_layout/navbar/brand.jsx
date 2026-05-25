'use client';

import { Copyright } from 'lucide-react';

export function NavbarBrand() {
  return (
    <div className='group flex cursor-pointer pb-5'>
      <div className='transition-transform duration-500 ease-in-expo group-hover:rotate-[360deg]'>
        <Copyright />
      </div>

      <div className='relative ms-2 flex overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-expo group-hover:pe-8'>
        <div className='flex transition-transform duration-500 ease-in-expo group-hover:-translate-x-full'>
          <h5>Code by</h5>
          <h5 className='ps-1'>Haris</h5>
        </div>
        <div className='absolute left-0 flex transition-transform duration-500 ease-in-expo translate-x-full group-hover:translate-x-0'>
          <h5>A brown Diary</h5>
        </div>
      </div>
    </div>
  );
}
