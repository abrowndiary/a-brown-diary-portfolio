'use client';

import Link from 'next/link';
import Balancer from 'react-wrap-balancer';

import { MagneticButton, ParallaxFade, ParallaxReveal } from '@/components';
import { siteContent } from '@/content';

import { Title, Wrapper } from './index.styled';

export function Description() {
  return (
    <article className='container relative'>
      <Wrapper>
        <div className='basis-full lg:basis-8/12'>
          <Title>
            <ParallaxReveal paragraph={siteContent.home.intro} />
          </Title>
        </div>

        <div className='flex basis-7/12 flex-col items-start gap-16 lg:basis-3/12'>
          <ParallaxFade>
            <Balancer as='p' className='mt-2 text-base lg:text-lg'>
              {siteContent.home.supportingText}
            </Balancer>
          </ParallaxFade>
          <ParallaxFade>
            <Link href='/about' passHref>
              <MagneticButton variant='ghost' size='xl'>
                About me
              </MagneticButton>
            </Link>
          </ParallaxFade>
        </div>
      </Wrapper>
    </article>
  );
}
