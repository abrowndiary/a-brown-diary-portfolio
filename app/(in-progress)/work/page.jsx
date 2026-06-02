import { Grid2X2, Menu } from 'lucide-react';
import Link from 'next/link';

import { siteContent } from '@/content';
import { Contact, Navbar, Transition } from '@/layout';

export const metadata = {
  title: `Work | ${siteContent.site.name}`,
  description: siteContent.site.metaDescription,
};

export default function Work() {
  const categories = siteContent.work.filters.map(filter => ({
    label: filter,
    count:
      filter === 'All'
        ? siteContent.projects.length
        : siteContent.projects.filter(project => project.category === filter)
            .length,
  }));

  return (
    <Transition>
      <Navbar />
      <main className='bg-background text-foreground'>
        <section className='container flex min-h-[74vh] items-end pb-20 pt-40'>
          <div className='mx-auto w-full max-w-6xl'>
            <h1 className='max-w-4xl text-[clamp(4rem,8vw,8.5rem)] font-light leading-[0.95] tracking-normal'>
              {siteContent.work.headline}
            </h1>

            <div className='mt-14 flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
              <div className='flex flex-wrap gap-3'>
                {categories.map(({ label, count }, index) => (
                  <button
                    key={label}
                    type='button'
                    className={`group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border px-7 text-sm font-medium transition-colors ${
                      index === 0
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-foreground hover:border-primary hover:text-background'
                    }`}
                  >
                    <span className='absolute inset-x-[-10%] top-0 h-full -translate-x-full rounded-full bg-primary transition-transform duration-300 ease-in-expo group-hover:translate-x-0' />
                    <span className='relative z-10'>
                      {label}
                      {index > 0 ? (
                        <sup className='ml-1 text-[0.6rem]'>{count}</sup>
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>

              <div className='flex gap-3'>
                <button
                  type='button'
                  aria-label='List view'
                  className='size-14 grid place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105'
                >
                  <Menu size={18} strokeWidth={1.5} />
                </button>
                <button
                  type='button'
                  aria-label='Grid view'
                  className='size-14 group relative grid place-items-center overflow-hidden rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-background'
                >
                  <span className='absolute inset-x-[-10%] top-0 h-full -translate-x-full rounded-full bg-primary transition-transform duration-300 ease-in-expo group-hover:translate-x-0' />
                  <Grid2X2
                    className='relative z-10'
                    size={17}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className='container pb-28'>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-[1.25fr_0.8fr_1fr_0.35fr] border-b border-border pb-6 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground max-md:hidden'>
              <span>Client</span>
              <span>Location</span>
              <span>Services</span>
              <span>Year</span>
            </div>
            <ul className='group/list'>
              {siteContent.projects.map(project => {
                const preview = project.media?.[0]?.src;

                return (
                  <li
                    key={project.slug}
                    className='group/work md:group-hover/list:opacity-35 relative border-b border-border transition-opacity duration-300 hover:!opacity-100'
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      className='grid items-center gap-4 py-8 transition-transform duration-300 ease-out md:grid-cols-[1.25fr_0.8fr_1fr_0.35fr] md:group-hover/work:translate-x-4'
                    >
                      <h2 className='text-[clamp(2rem,3.8vw,4rem)] font-light leading-none transition-transform duration-300 ease-out md:group-hover/work:-translate-x-4'>
                        {project.title}
                      </h2>
                      <p className='text-base text-muted-foreground'>
                        {project.location}
                      </p>
                      <p className='text-base text-muted-foreground'>
                        {project.services}
                      </p>
                      <p className='text-base'>{project.year}</p>
                    </Link>

                    <div className='pointer-events-none fixed left-1/2 top-1/2 z-20 hidden h-[19rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 scale-95 overflow-hidden bg-[#4a4a4a] opacity-0 shadow-2xl transition duration-300 group-hover/work:scale-100 group-hover/work:opacity-100 md:block'>
                      {preview ? (
                        <div
                          className='size-full bg-cover bg-center'
                          style={{ backgroundImage: `url(${preview})` }}
                        />
                      ) : (
                        <div className='size-full flex items-center justify-center p-8 text-center text-4xl font-light leading-tight text-background'>
                          {project.title}
                        </div>
                      )}
                      <span className='size-24 absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-sm font-medium text-background'>
                        View
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className='flex justify-center pt-20'>
              <button
                type='button'
                className='min-w-44 group relative inline-flex h-20 items-center justify-center overflow-hidden rounded-full bg-foreground px-9 text-base font-medium text-background'
              >
                <span className='absolute inset-x-[-10%] top-0 h-full -translate-x-full rounded-full bg-primary transition-transform duration-300 ease-in-expo group-hover:translate-x-0' />
                <span className='relative z-10'>
                  Archive
                  <sup className='ml-1 text-[0.65rem]'>
                    {siteContent.work.archiveCount}
                  </sup>
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
      <Contact />
    </Transition>
  );
}
