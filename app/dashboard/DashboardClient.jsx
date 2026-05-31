'use client';

import { useEffect, useState } from 'react';

export function DashboardClient({ initialContent }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [draft, setDraft] = useState(JSON.stringify(initialContent, null, 2));
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/session')
      .then(response => response.json())
      .then(data => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  async function login(event) {
    event.preventDefault();
    setMessage('');

    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Login failed.');
      return;
    }

    setAuthenticated(true);
    setPassword('');
  }

  async function publish() {
    setMessage('');

    let parsed;
    try {
      parsed = JSON.parse(draft);
    } catch {
      setMessage('JSON is invalid. Fix it before publishing.');
      return;
    }

    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    const data = await response.json();

    setMessage(
      response.ok
        ? 'Published to GitHub. Your host may need a redeploy to show it publicly.'
        : data.error || 'Publish failed.',
    );
  }

  if (!authenticated) {
    return (
      <main className='grid min-h-screen place-items-center bg-background p-6 text-foreground'>
        <form
          onSubmit={login}
          className='w-full max-w-md border-t border-border pt-8'
        >
          <p className='mb-5 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
            Owner dashboard
          </p>
          <h1 className='mb-8 text-5xl font-light'>Sign in</h1>
          <input
            type='password'
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder='Admin password'
            className='w-full border-b border-border bg-transparent py-4 outline-none'
          />
          <button className='mt-8 rounded-full bg-foreground px-8 py-4 text-background'>
            Continue
          </button>
          {message ? <p className='mt-6 text-sm'>{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-background p-6 text-foreground lg:p-10'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 flex flex-wrap items-end justify-between gap-6'>
          <div>
            <p className='mb-4 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
              Owner dashboard
            </p>
            <h1 className='text-[clamp(3rem,7vw,7rem)] font-light leading-none'>
              Edit content
            </h1>
          </div>
          <button
            onClick={publish}
            className='rounded-full bg-foreground px-8 py-4 text-background'
          >
            Publish changes
          </button>
        </div>

        <div className='grid gap-6 lg:grid-cols-[0.35fr_0.65fr]'>
          <aside className='space-y-4 text-muted-foreground'>
            <p>
              Edit text, contact details, projects and media URLs in this JSON.
              Leave socialLinks empty unless you want social buttons visible.
            </p>
            <p>
              Publishing requires ADMIN_PASSWORD, ADMIN_SECRET and GITHUB_TOKEN
              in the deployment environment.
            </p>
            {message ? <p className='text-foreground'>{message}</p> : null}
          </aside>
          <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
            spellCheck={false}
            className='min-h-[70vh] w-full rounded border border-border bg-secondary p-5 font-mono text-sm leading-relaxed outline-none'
          />
        </div>
      </div>
    </main>
  );
}
