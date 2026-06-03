import { ArrowDownRight } from 'lucide-react';

import { ParallaxReveal } from '@/components';
import { siteContent } from '@/content';
import { Contact, Navbar, Transition } from '@/layout';

export const metadata = {
  title: `About | ${siteContent.site.name}`,
  description: siteContent.site.metaDescription,
};

export default function About() {
  return (
    <Transition>
      <Navbar />
      <main className='bg-background text-foreground'>
        <section className='container flex min-h-screen items-end pb-24 pt-40'>
          <div className='grid w-full gap-12 lg:grid-cols-[1.45fr_0.55fr] lg:items-end'>
            <h1 className='max-w-5xl text-[clamp(4rem,7vw,8.5rem)] font-light leading-[0.95]'>
              {siteContent.about.headline}
            </h1>
            <div className='space-y-10'>
              <p className='text-xl leading-relaxed'>
                {siteContent.home.supportingText}
              </p>
              <div className='size-40 relative grid place-items-center rounded-full bg-primary text-background'>
                <div className='globe-element !size-16 !relative !left-auto !top-auto !translate-x-0 !translate-y-0'>
                  <span className='globe-wrap-element'>
                    <span className='circle-element' />
                    <span className='circle-element' />
                    <span className='circle-element' />
                    <span className='circle-hor-element' />
                    <span className='circle-hor-middle-element' />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container border-t border-border py-24'>
          <div className='grid gap-12 lg:grid-cols-[0.75fr_1.25fr]'>
            <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Profile
            </p>
            <div className='space-y-8 text-[clamp(1.6rem,3vw,3.5rem)] font-light leading-tight'>
              <p>
                <ParallaxReveal paragraph={siteContent.about.intro} />
              </p>
              <p className='max-w-3xl text-xl leading-relaxed text-muted-foreground'>
                {siteContent.about.body}
              </p>
            </div>
          </div>
        </section>

        <section className='container py-12'>
          <div className='grid gap-6 md:grid-cols-[1.1fr_0.9fr]'>
            <div className='min-h-[34rem] bg-foreground p-10 text-background'>
              <p className='text-sm uppercase tracking-[0.18em] text-background/60'>
                A Brown Diary
              </p>
              <div className='mt-24 text-[clamp(3rem,7vw,8rem)] font-light leading-none'>
                ABD
              </div>
            </div>
            <div className='grid min-h-[34rem] place-items-center bg-muted p-10'>
              <div className='max-w-sm space-y-6'>
                <ArrowDownRight size={36} strokeWidth={1.25} />
                <p className='text-2xl font-light leading-snug'>
                  Practical notes, systems and projects across technology,
                  business and life in Germany.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='container py-24'>
          <p className='mb-10 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
            I can help with
          </p>
          <div className='border-t border-border'>
            {siteContent.about.services.map(service => (
              <article
                key={service.title}
                className='group grid gap-8 border-b border-border py-10 transition-opacity duration-300 hover:opacity-100 md:grid-cols-[0.18fr_0.82fr_1.2fr]'
              >
                <p className='text-sm text-muted-foreground'>
                  {service.kicker}
                </p>
                <h2 className='text-[clamp(2.5rem,4.8vw,5.75rem)] font-light leading-none transition-transform duration-300 group-hover:translate-x-4'>
                  {service.title}
                </h2>
                <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Contact />
    </Transition>
  );
}
