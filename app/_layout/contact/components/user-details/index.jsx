'use client';

import { motion } from 'framer-motion';
import { ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';

import { MagneticButton } from '@/components';
import { siteContent } from '@/content';

import { Container, ImageWrapper, MainTitle, Row } from './index.styled';

/**
 * @param {Object} props
 * @param {import('framer-motion').MotionValue<number>} props.transformX
 */
export function UserDetails({ transformX }) {
  return (
    <Container>
      <Row>
        <div className='flex items-center gap-8'>
          <ImageWrapper>
            <div className='size-full grid place-items-center rounded-full bg-background text-foreground'>
              <span className='text-sm uppercase tracking-[0.18em]'>
                {siteContent.site.name
                  .split(' ')
                  .map(word => word[0])
                  .join('')}
              </span>
            </div>
          </ImageWrapper>
          <MainTitle>{siteContent.site.contactIntro.split(' ')[0]}</MainTitle>
        </div>
        <div className='flex items-center justify-between'>
          <MainTitle>
            {siteContent.site.contactIntro.split(' ').slice(1).join(' ')}
          </MainTitle>
          <div>
            <ArrowDownLeft size={28} strokeWidth={1.25} />
          </div>
        </div>
      </Row>

      <Row>
        <div className='relative w-full'>
          <div className='h-[1px] bg-muted-foreground' />
          <div className='absolute right-0 top-0 z-20 -translate-x-1/2 -translate-y-1/2'>
            <motion.div style={{ x: transformX }}>
              <Link href='/contact' passHref>
                <MagneticButton variant='primary' size='lg'>
                  Get in touch
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </Row>

      <Row>
        <div className='flex w-full flex-col gap-4 lg:flex-row'>
          <div>
            <a href={`mailto:${siteContent.site.email}`}>
              <MagneticButton
                variant='outline'
                size='md'
                className='w-full border-muted-foreground'
              >
                {siteContent.site.email}
              </MagneticButton>
            </a>
          </div>
          <div>
            <a href={`tel:${siteContent.site.phone.replaceAll(' ', '')}`}>
              <MagneticButton
                variant='outline'
                size='md'
                className='w-full border-muted-foreground'
              >
                {siteContent.site.phone}
              </MagneticButton>
            </a>
          </div>
        </div>
      </Row>
    </Container>
  );
}
