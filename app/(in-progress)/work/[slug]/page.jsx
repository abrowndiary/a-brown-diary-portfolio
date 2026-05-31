import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProjectBySlug, siteContent } from '@/content';
import { Contact, Navbar, Transition } from '@/layout';

export function generateStaticParams() {
  return siteContent.projects.map(project => ({ slug: project.slug }));
}

export function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | ${siteContent.site.name}`,
    description: project.description,
  };
}

export default function ProjectDetail({ params }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const currentIndex = siteContent.projects.findIndex(
    item => item.slug === project.slug,
  );
  const nextProject =
    siteContent.projects[(currentIndex + 1) % siteContent.projects.length];

  return (
    <Transition>
      <Navbar />
      <main className='bg-background text-foreground'>
        <section className='container flex min-h-screen flex-col justify-end pb-20 pt-40'>
          <Link
            href='/work'
            className='mb-12 inline-flex text-sm uppercase tracking-[0.18em] text-muted-foreground'
          >
            All work {siteContent.projects.length}
          </Link>
          <h1 className='text-[clamp(4rem,13vw,13rem)] font-light leading-[0.9]'>
            {project.title}
          </h1>
        </section>

        <section className='container grid gap-10 border-y border-border py-12 md:grid-cols-3'>
          <div>
            <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Role / Services
            </p>
            <p className='mt-5 text-xl'>{project.services}</p>
          </div>
          <div>
            <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Location
            </p>
            <p className='mt-5 text-xl'>{project.location}</p>
          </div>
          <div>
            <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Year
            </p>
            <p className='mt-5 text-xl'>{project.year}</p>
          </div>
        </section>

        <section className='container py-20'>
          <p className='max-w-4xl text-[clamp(1.75rem,4vw,4.5rem)] font-light leading-tight'>
            {project.description}
          </p>
        </section>

        <section className='container grid gap-8 pb-24'>
          {project.media?.length ? (
            project.media.map(item => (
              <div
                key={item.src}
                className='relative aspect-video overflow-hidden rounded bg-secondary-foreground'
              >
                {item.type === 'video' ? (
                  <video
                    className='size-full object-cover'
                    src={item.src}
                    controls
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className='size-full object-cover'
                    src={item.src}
                    alt={item.alt || project.title}
                  />
                )}
              </div>
            ))
          ) : (
            <div className='grid aspect-video place-items-center rounded bg-[linear-gradient(135deg,#1c1d20,#4c4f56_55%,#c8c4b8)] p-8 text-center text-background'>
              <p className='text-[clamp(2rem,6vw,7rem)] font-light leading-none'>
                Add media in dashboard
              </p>
            </div>
          )}
        </section>

        <section className='container border-t border-border py-20'>
          <Link href={`/work/${nextProject.slug}`} className='group block'>
            <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Next case
            </p>
            <h2 className='mt-6 text-[clamp(3rem,8vw,9rem)] font-light leading-none transition-transform duration-500 group-hover:translate-x-8'>
              {nextProject.title}
            </h2>
          </Link>
        </section>
      </main>
      <Contact />
    </Transition>
  );
}
