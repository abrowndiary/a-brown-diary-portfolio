import { Contact, Navbar, Transition } from '@/layout';

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'Work | A Brown Diary',
  description:
    'Helping brands thrive in the digital world. Located in Germany. Tech, AI, Cybersecurity, Automation, Business & Life in Germany.',
};

export default function Work() {
  return (
    <Transition>
      <Navbar />
      <div className='relative flex h-[60vh] items-center justify-center bg-secondary-foreground text-background'>
        <h1 className='text-[clamp(3em,8vw,6em)] font-light lowercase'>work</h1>
      </div>
      <main className='flex min-h-[40vh] items-center justify-center bg-background p-8 text-foreground'>
        <p className='max-w-2xl text-center text-xl font-light leading-relaxed'>
          Explore my latest domains and projects covering Automation,
          Development, Experiences, and Technology Consulting.
        </p>
      </main>
      <Contact />
    </Transition>
  );
}
