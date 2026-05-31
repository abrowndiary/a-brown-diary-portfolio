import Link from 'next/link';

import { siteContent } from '@/content';
import { Contact, Navbar, Transition } from '@/layout';

export const metadata = {
  title: `Work | ${siteContent.site.name}`,
  description: siteContent.site.metaDescription,
};

export default function Work() {
  return (
    <Transition>
      <Navbar />
      <main className='bg-background text-foreground'>
        <section className='container flex min-h-[80vh] flex-col justify-end pb-20 pt-40'>
          <h1 className='max-w-6xl text-[clamp(3.75rem,9vw,9rem)] font-light leading-[0.95]'>
            {siteContent.work.headline}
          </h1>
          <div className='mt-12 flex flex-wrap gap-3'>
            {siteContent.work.filters.map(filter => (
              <span
                key={filter}
                className='rounded-full border border-border px-5 py-2 text-sm'
              >
                {filter}
              </span>
            ))}
          </div>
        </section>

        <section className='container pb-24'>
          <div className='grid grid-cols-[1fr_0.7fr_0.5fr] border-b border-border pb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground max-md:hidden'>
            <span>Title</span>
            <span>Services</span>
            <span>Year</span>
          </div>
          <ul className='group/list'>
            {siteContent.projects.map(project => (
              <li
                key={project.slug}
                className='work-list-item group-hover/list:opacity-35 border-b border-border transition-opacity duration-300 hover:!opacity-100'
              >
                <Link
                  href={`/work/${project.slug}`}
                  className='grid items-center gap-6 py-8 md:grid-cols-[1fr_0.7fr_0.5fr]'
                >
                  <h2 className='text-[clamp(2.5rem,6vw,7rem)] font-light leading-none'>
                    {project.title}
                  </h2>
                  <p className='text-lg text-muted-foreground'>
                    {project.services}
                  </p>
                  <p className='text-lg'>{project.year}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Contact />
    </Transition>
  );
}
