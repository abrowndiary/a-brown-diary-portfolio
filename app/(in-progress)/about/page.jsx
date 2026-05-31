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
        <section className='container flex min-h-screen flex-col justify-end pb-24 pt-40'>
          <p className='mb-8 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
            About
          </p>
          <h1 className='max-w-6xl text-[clamp(3.75rem,9vw,9rem)] font-light leading-[0.95]'>
            {siteContent.about.headline}
          </h1>
        </section>

        <section className='container grid gap-12 border-t border-border py-24 lg:grid-cols-[1fr_2fr]'>
          <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
            Profile
          </p>
          <div className='space-y-8 text-[clamp(1.6rem,3vw,3.75rem)] font-light leading-tight'>
            <p>
              <ParallaxReveal paragraph={siteContent.about.intro} />
            </p>
            <p className='max-w-3xl text-xl leading-relaxed text-muted-foreground'>
              {siteContent.about.body}
            </p>
          </div>
        </section>

        <section className='container py-12'>
          <div className='border-t border-border'>
            {siteContent.about.services.map(service => (
              <article
                key={service.title}
                className='grid gap-8 border-b border-border py-10 transition-opacity duration-300 hover:opacity-70 md:grid-cols-[0.25fr_0.75fr_1.5fr]'
              >
                <p className='text-sm text-muted-foreground'>
                  {service.kicker}
                </p>
                <h2 className='text-[clamp(2rem,4vw,4.5rem)] font-light leading-none'>
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
