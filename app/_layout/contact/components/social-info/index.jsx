'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { MagneticButton } from '@/components';
import { socialMedias } from '@/data';
import { randomId } from '@/utils';

import { ListTitle } from './index.styled';

export function SocialInfo() {
  const [timeStr, setTimeStr] = useState('');
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      });
      setTimeStr(formatter.format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const medias = socialMedias.map(({ href, title }) => {
    const id = randomId();
    return (
      <li
        key={id}
        className='border-b border-solid border-b-transparent transition-all duration-300 ease-in-expo hover:border-b-border'
      >
        <Link href={href} target='_blank' rel='noopener' passHref>
          <MagneticButton>{title}</MagneticButton>
        </Link>
      </li>
    );
  });

  return (
    <div className='px-12 pb-4 pt-10'>
      <div className='flex flex-wrap items-stretch justify-between gap-5'>
        <div className='flex gap-8'>
          <div>
            <ListTitle>Version</ListTitle>
            <p className='mt-7'>{year} © Edition</p>
          </div>
          <div>
            <ListTitle>Local time</ListTitle>
            <p className='mt-7'>
              <time>{timeStr || '05:00 PM GMT+2'}</time>
            </p>
          </div>
        </div>

        <div className='flex flex-col'>
          <ListTitle>Socials</ListTitle>
          <ul className='flex gap-8'>{medias}</ul>
        </div>
      </div>
    </div>
  );
}
