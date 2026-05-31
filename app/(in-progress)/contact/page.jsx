import { siteContent } from '@/content';
import { Contact, Navbar, Transition } from '@/layout';

export const metadata = {
  title: `Contact | ${siteContent.site.name}`,
  description: siteContent.site.metaDescription,
};

export default function ContactPage() {
  return (
    <Transition>
      <Navbar />
      <main className='bg-background text-foreground'>
        <section className='container grid min-h-screen gap-16 pb-24 pt-40 lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='flex flex-col justify-end'>
            <p className='mb-8 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Contact
            </p>
            <h1 className='text-[clamp(3.75rem,9vw,8rem)] font-light leading-[0.95]'>
              {siteContent.contact.headline}
            </h1>
          </div>

          <form className='self-end border-t border-border'>
            {siteContent.contact.formFields.map((field, index) => (
              <label
                key={field.label}
                className='grid gap-4 border-b border-border py-7'
              >
                <span className='text-sm text-muted-foreground'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className='text-2xl font-light'>{field.label}</span>
                <input
                  className='bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground'
                  placeholder={field.placeholder}
                />
              </label>
            ))}
            <button
              type='button'
              className='mt-8 rounded-full bg-foreground px-8 py-4 text-background'
            >
              Prepare message
            </button>
          </form>
        </section>

        <section className='container grid gap-8 border-t border-border py-16 md:grid-cols-3'>
          {siteContent.contact.details.map(detail => (
            <div key={detail.label}>
              <p className='text-sm uppercase tracking-[0.18em] text-muted-foreground'>
                {detail.label}
              </p>
              {detail.href ? (
                <a className='mt-4 block text-xl' href={detail.href}>
                  {detail.value}
                </a>
              ) : (
                <p className='mt-4 text-xl'>{detail.value}</p>
              )}
            </div>
          ))}
        </section>
      </main>
      <Contact />
    </Transition>
  );
}
