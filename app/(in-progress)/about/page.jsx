import { Contact, Navbar, Transition } from '@/layout';

/** @type {import('next').Metadata} */
export const metadata = {
  title: 'About | A Brown Diary',
  description:
    'Helping brands thrive in the digital world. Located in Germany. Tech, AI, Cybersecurity, Automation, Business & Life in Germany.',
};

export default function About() {
  return (
    <Transition>
      <Navbar />
      <div className='relative flex h-[60vh] items-center justify-center bg-secondary-foreground text-background'>
        <h1 className='text-[clamp(3em,8vw,6em)] font-light lowercase'>
          about
        </h1>
      </div>
      <main className='flex min-h-[40vh] items-center justify-center bg-background p-8 text-foreground'>
        <p className='max-w-2xl text-center text-xl font-light leading-relaxed'>
          A Brown Diary is a digital diary covering Tech, AI, Cybersecurity,
          Automation, Business, Productivity, and Life in Germany. Delivering
          modern solutions and building interactive web experiences.
        </p>
      </main>
      <Contact />
    </Transition>
  );
}
