import { ArrowDownLeft } from 'lucide-react';

import { siteContent } from '@/content';
import { Navbar, Transition } from '@/layout';

export const metadata = {
  title: `Contact | ${siteContent.site.name}`,
  description: siteContent.site.metaDescription,
};

export default function ContactPage() {
  return (
    <Transition>
      <Navbar />
      <main className='min-h-screen bg-foreground text-background'>
        <section className='container grid min-h-screen gap-16 pb-24 pt-40 lg:grid-cols-[1.15fr_0.85fr] lg:items-end'>
          <div>
            <div className='mb-16 flex items-start justify-between gap-12'>
              <h1 className='max-w-3xl text-[clamp(4.5rem,8vw,9.5rem)] font-light leading-[0.92]'>
                {siteContent.contact.headline}
              </h1>
              <div className='size-32 mt-10 hidden shrink-0 items-center justify-center rounded-full bg-background text-foreground lg:flex'>
                <span className='text-sm uppercase tracking-[0.16em]'>ABD</span>
              </div>
            </div>

            <ArrowDownLeft
              className='ml-auto mr-24 hidden lg:block'
              size={30}
              strokeWidth={1.25}
            />

            <form className='mt-24 border-t border-background/20'>
              {siteContent.contact.formFields.map((field, index) => (
                <label
                  key={field.label}
                  className='grid gap-4 border-b border-background/20 py-7 md:grid-cols-[0.16fr_1fr]'
                >
                  <span className='text-background/45 text-sm'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className='block text-xl font-medium'>
                      {field.label}
                    </span>
                    <input
                      className='placeholder:text-background/35 mt-4 w-full bg-transparent text-lg text-background outline-none'
                      placeholder={field.placeholder}
                    />
                  </span>
                </label>
              ))}

              <button
                type='button'
                className='min-w-48 group relative mt-8 inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-background px-8 text-base font-medium text-foreground'
              >
                <span className='absolute inset-x-[-10%] top-0 h-full -translate-x-full rounded-full bg-primary transition-transform duration-300 ease-in-expo group-hover:translate-x-0' />
                <span className='relative z-10 transition-colors group-hover:text-background'>
                  Prepare message
                </span>
              </button>
            </form>
          </div>

          <aside className='space-y-12 pb-20 lg:pl-12'>
            <section>
              <p className='mb-4 text-xs uppercase tracking-[0.12em] text-background/40'>
                Contact details
              </p>
              <div className='space-y-3 text-lg font-medium'>
                {siteContent.contact.details.map(detail =>
                  detail.href ? (
                    <a
                      key={detail.label}
                      href={detail.href}
                      className='block hover:text-primary'
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p key={detail.label}>{detail.value}</p>
                  ),
                )}
              </div>
            </section>

            <section>
              <p className='mb-4 text-xs uppercase tracking-[0.12em] text-background/40'>
                Business details
              </p>
              <div className='space-y-3 text-lg font-medium'>
                <p>{siteContent.site.name}</p>
                <p>Location: {siteContent.site.location}</p>
                <p>{siteContent.site.tagline}</p>
              </div>
            </section>

            <section>
              <p className='mb-4 text-xs uppercase tracking-[0.12em] text-background/40'>
                Socials
              </p>
              <div className='space-y-3 text-lg font-medium'>
                {siteContent.socialLinks.map(link => (
                  <a key={link.title} href={link.href} className='block'>
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <footer className='container flex flex-wrap justify-between gap-8 border-t border-background/20 py-8 text-sm text-background/70'>
          <span>2026 © Edition</span>
          <span>Local time · {siteContent.site.timezone}</span>
          <span>{siteContent.socialLinks[0]?.title ?? 'YouTube'}</span>
        </footer>
      </main>
    </Transition>
  );
}
