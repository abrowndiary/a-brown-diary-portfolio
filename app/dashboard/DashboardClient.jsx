'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Check,
  Circle,
  FolderKanban,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Plus,
  Settings,
  Trash2,
  UploadCloud,
} from 'lucide-react';

const views = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pages', label: 'Page Text', icon: Globe2 },
  { id: 'projects', label: 'Manage Projects', icon: FolderKanban },
  { id: 'add', label: 'Add New Project', icon: Plus },
  { id: 'media', label: 'Media Library', icon: ImageIcon },
  { id: 'settings', label: 'Global Settings', icon: Settings },
];

const emptyProject = {
  slug: '',
  title: '',
  subtitle: '',
  location: '',
  services: '',
  year: new Date().getFullYear().toString(),
  category: '',
  categories: [],
  description: '',
  media: [],
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cloneProject(project = emptyProject) {
  return {
    ...emptyProject,
    ...project,
    categories:
      project.categories || (project.category ? [project.category] : []),
    media: project.media || [],
  };
}

function Field({ label, children }) {
  return (
    <label className='grid gap-2'>
      <span className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className='w-full rounded border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground'
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className='min-h-36 w-full rounded border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-foreground'
    />
  );
}

function SectionCard({ title, eyebrow, children }) {
  return (
    <section className='rounded bg-secondary p-6 lg:p-8'>
      <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
        {eyebrow}
      </p>
      <h2 className='mb-8 mt-3 text-4xl font-light'>{title}</h2>
      <div className='grid gap-5'>{children}</div>
    </section>
  );
}

function MediaUploader({ onUpload, compact = false }) {
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files) {
    const [file] = Array.from(files || []);
    if (file) {
      await onUpload(file);
    }
  }

  return (
    <div
      onDragOver={event => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={event => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`grid place-items-center rounded border border-dashed p-6 text-center transition ${
        dragging
          ? 'border-foreground bg-secondary'
          : 'border-border bg-background'
      } ${compact ? 'min-h-36' : 'min-h-52'}`}
    >
      <div>
        <UploadCloud className='mx-auto mb-4' size={28} strokeWidth={1.5} />
        <p className='text-sm'>Drop an image or video here</p>
        <p className='mt-2 text-xs text-muted-foreground'>
          The file is committed to `public/images/` and returned as a local URL.
        </p>
        <label className='mt-5 inline-flex cursor-pointer rounded-full bg-foreground px-5 py-3 text-sm text-background'>
          Choose file
          <input
            type='file'
            accept='image/*,video/*'
            className='hidden'
            onChange={event => handleFiles(event.target.files)}
          />
        </label>
      </div>
    </div>
  );
}

function formatBytes(bytes = 0) {
  if (!bytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

function getMediaUsage(content, path) {
  const usage = [];

  if (content.home.heroMedia?.src === path) {
    usage.push('Hero background');
  }

  content.projects.forEach(project => {
    if ((project.media || []).some(item => item.src === path)) {
      usage.push(project.title);
    }
  });

  return usage;
}

function ProjectForm({ project, filters, onChange, onUpload, title }) {
  const tagOptions = filters.filter(filter => filter.toLowerCase() !== 'all');
  const activeTags = project.categories || [];

  function update(field, value) {
    onChange({ ...project, [field]: value });
  }

  function toggleTag(tag) {
    const nextTags = activeTags.includes(tag)
      ? activeTags.filter(item => item !== tag)
      : [...activeTags, tag];

    onChange({
      ...project,
      categories: nextTags,
      category: nextTags[0] || '',
    });
  }

  return (
    <section className='rounded bg-secondary p-6 lg:p-8'>
      <div className='mb-8 flex items-center justify-between gap-4'>
        <div>
          <p className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
            Project editor
          </p>
          <h2 className='mt-2 text-4xl font-light'>{title}</h2>
        </div>
        <Circle size={10} className='fill-foreground' />
      </div>

      <div className='grid gap-5 md:grid-cols-2'>
        <Field label='Title'>
          <TextInput
            value={project.title}
            onChange={event => {
              const titleValue = event.target.value;
              onChange({
                ...project,
                title: titleValue,
                slug: project.slug || slugify(titleValue),
              });
            }}
            placeholder='Project title'
          />
        </Field>
        <Field label='Slug'>
          <TextInput
            value={project.slug}
            onChange={event => update('slug', slugify(event.target.value))}
            placeholder='project-url-slug'
          />
        </Field>
        <Field label='Subtitle'>
          <TextInput
            value={project.subtitle || ''}
            onChange={event => update('subtitle', event.target.value)}
            placeholder='Short supporting line'
          />
        </Field>
        <Field label='Services'>
          <TextInput
            value={project.services}
            onChange={event => update('services', event.target.value)}
            placeholder='AI, automation, writing'
          />
        </Field>
        <Field label='Location'>
          <TextInput
            value={project.location}
            onChange={event => update('location', event.target.value)}
            placeholder='Germany'
          />
        </Field>
        <Field label='Year'>
          <TextInput
            value={project.year}
            onChange={event => update('year', event.target.value)}
            placeholder='2026'
          />
        </Field>
      </div>

      <div className='mt-6 grid gap-2'>
        <span className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
          Category tags
        </span>
        <div className='flex flex-wrap gap-2'>
          {tagOptions.map(tag => {
            const selected = activeTags.includes(tag);

            return (
              <button
                key={tag}
                type='button'
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  selected
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-foreground'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className='mt-6'>
        <Field label='Long-form description'>
          <TextArea
            value={project.description}
            onChange={event => update('description', event.target.value)}
            placeholder='Write the project story, result, scope and notes.'
          />
        </Field>
      </div>

      <div className='mt-6 grid gap-4'>
        <span className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
          Media
        </span>
        <MediaUploader
          onUpload={async file => {
            const media = await onUpload(file);
            if (media) {
              update('media', [
                ...(project.media || []),
                {
                  type: media.type,
                  src: media.path,
                  alt: project.title || file.name,
                },
              ]);
            }
          }}
        />
        <div className='grid gap-3 md:grid-cols-2'>
          {(project.media || []).map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className='flex items-center justify-between gap-4 rounded border border-border bg-background p-3'
            >
              <span className='truncate text-sm'>{item.src}</span>
              <button
                type='button'
                className='text-xs uppercase tracking-[0.14em] text-muted-foreground'
                onClick={() =>
                  update(
                    'media',
                    project.media.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardClient({ initialContent }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(initialContent);
  const [activeView, setActiveView] = useState('overview');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [newProject, setNewProject] = useState(emptyProject);
  const [message, setMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [deletingMediaPath, setDeletingMediaPath] = useState('');

  useEffect(() => {
    fetch('/api/admin/session')
      .then(response => response.json())
      .then(data => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (authenticated && activeView === 'media') {
      loadMediaFiles();
    }
  }, [activeView, authenticated]);

  const categories = useMemo(
    () => content.work.filters.filter(filter => filter.toLowerCase() !== 'all'),
    [content.work.filters],
  );

  const selectedProject = cloneProject(content.projects[selectedProjectIndex]);
  const lastUpdated = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());

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
    setPublishing(true);
    setMessage('');

    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    const data = await response.json();

    setPublishing(false);
    setMessage(
      response.ok
        ? 'Published to GitHub. Redeploy your host if changes are not live yet.'
        : data.error || 'Publish failed.',
    );
  }

  async function uploadMedia(file) {
    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/media', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    setUploading(false);

    if (!response.ok) {
      setMessage(data.error || 'Upload failed.');
      return null;
    }

    setMessage(`Uploaded ${data.path}`);
    if (activeView === 'media') {
      await loadMediaFiles();
    }
    return data;
  }

  async function loadMediaFiles() {
    setLoadingMedia(true);
    setMessage('');

    const response = await fetch('/api/admin/media');
    const data = await response.json();

    setLoadingMedia(false);

    if (!response.ok) {
      setMessage(data.error || 'Could not load media library.');
      return;
    }

    setMediaFiles(data.files || []);
  }

  function removeMediaReferences(path) {
    setContent(current => ({
      ...current,
      home:
        current.home.heroMedia?.src === path
          ? {
              ...current.home,
              heroMedia: {
                type: 'placeholder',
                src: '',
                alt: `${current.site.name} hero background`,
              },
            }
          : current.home,
      projects: current.projects.map(project => ({
        ...project,
        media: (project.media || []).filter(item => item.src !== path),
      })),
    }));
  }

  async function deleteMedia(path) {
    const usage = getMediaUsage(content, path);
    const confirmed = window.confirm(
      usage.length
        ? `This file is used by: ${usage.join(
            ', ',
          )}. Delete it and remove those references from the draft?`
        : 'Delete this uploaded file from the repository?',
    );

    if (!confirmed) {
      return;
    }

    setDeletingMediaPath(path);
    setMessage('');

    const response = await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    const data = await response.json();

    setDeletingMediaPath('');

    if (!response.ok) {
      setMessage(data.error || 'Media deletion failed.');
      return;
    }

    removeMediaReferences(path);
    await loadMediaFiles();
    setMessage('Media deleted. Publish content if references were removed.');
  }

  function updateProject(index, project) {
    setContent(current => ({
      ...current,
      projects: current.projects.map((item, itemIndex) =>
        itemIndex === index ? project : item,
      ),
    }));
  }

  function addProject() {
    if (!newProject.title || !newProject.slug) {
      setMessage('Add a title and slug before adding the project.');
      return;
    }

    setContent(current => ({
      ...current,
      projects: [...current.projects, cloneProject(newProject)],
    }));
    setNewProject(emptyProject);
    setSelectedProjectIndex(content.projects.length);
    setActiveView('projects');
    setMessage('Project added. Publish when ready.');
  }

  function removeProject(index) {
    setContent(current => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
    }));
    setSelectedProjectIndex(0);
  }

  function updateSite(field, value) {
    const detailMap = {
      email: {
        label: 'Email',
        href: `mailto:${value}`,
      },
      phone: {
        label: 'Phone',
        href: `tel:${value.replaceAll(' ', '')}`,
      },
      location: {
        label: 'Location',
        href: '',
      },
    };

    setContent(current => ({
      ...current,
      site: { ...current.site, [field]: value },
      contact: detailMap[field]
        ? {
            ...current.contact,
            details: current.contact.details.map(detail =>
              detail.label === detailMap[field].label
                ? { ...detail, value, href: detailMap[field].href }
                : detail,
            ),
          }
        : current.contact,
    }));
  }

  function updateYoutube(field, value) {
    const [firstLink = { title: 'YouTube', href: '#' }] = content.socialLinks;

    setContent(current => ({
      ...current,
      socialLinks: [{ ...firstLink, title: 'YouTube', [field]: value }],
    }));
  }

  function updateFilters(value) {
    const filters = value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    setContent(current => ({
      ...current,
      work: { ...current.work, filters },
    }));
  }

  function updateSection(section, field, value) {
    setContent(current => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function updateFormField(index, field, value) {
    setContent(current => ({
      ...current,
      contact: {
        ...current.contact,
        formFields: current.contact.formFields.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  function updateAboutService(index, field, value) {
    setContent(current => ({
      ...current,
      about: {
        ...current.about,
        services: current.about.services.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  async function uploadHeroMedia(file) {
    const media = await uploadMedia(file);

    if (media) {
      setContent(current => ({
        ...current,
        home: {
          ...current.home,
          heroMedia: {
            type: media.type,
            src: media.path,
            alt: `${current.site.name} hero background`,
          },
        },
      }));
    }
  }

  if (!authenticated) {
    return (
      <main className='grid min-h-screen place-items-center bg-background p-6 text-foreground'>
        <form
          onSubmit={login}
          className='w-full max-w-md border-t border-border pt-8'
        >
          <p className='mb-5 text-sm uppercase tracking-[0.18em] text-muted-foreground'>
            Owner CMS
          </p>
          <h1 className='mb-8 text-5xl font-light'>Sign in</h1>
          <TextInput
            type='password'
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder='Admin password'
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
    <main className='min-h-screen bg-background text-foreground'>
      <aside className='fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-secondary p-5 lg:block'>
        <div className='mb-10 border-b border-border pb-8'>
          <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
            A Brown Diary
          </p>
          <h1 className='mt-3 text-3xl font-light'>Visual CMS</h1>
        </div>
        <nav className='grid gap-2'>
          {views.map(view => {
            const Icon = view.icon;
            const selected = activeView === view.id;

            return (
              <button
                key={view.id}
                type='button'
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-3 rounded px-4 py-3 text-left text-sm transition ${
                  selected
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {view.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className='lg:pl-72'>
        <header className='sticky top-0 z-20 border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-10'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
                {views.find(view => view.id === activeView)?.label}
              </p>
              <h2 className='mt-1 text-2xl font-light'>Content workspace</h2>
            </div>
            <div className='flex items-center gap-3'>
              {message ? (
                <p className='max-w-sm text-sm text-muted-foreground'>
                  {message}
                </p>
              ) : null}
              {uploading ? (
                <span className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
                  <Loader2 size={16} className='animate-spin' />
                  Uploading
                </span>
              ) : null}
              <button
                type='button'
                onClick={publish}
                disabled={publishing}
                className='inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background disabled:opacity-60'
              >
                {publishing ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <Check size={16} />
                )}
                Publish changes
              </button>
            </div>
          </div>
          <div className='mt-4 flex gap-2 overflow-x-auto lg:hidden'>
            {views.map(view => (
              <button
                key={view.id}
                type='button'
                onClick={() => setActiveView(view.id)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  activeView === view.id
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </header>

        <div className='p-5 lg:p-10'>
          {activeView === 'overview' ? (
            <div className='grid gap-6'>
              <section className='rounded bg-secondary p-8'>
                <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
                  Overview
                </p>
                <h2 className='mt-3 max-w-4xl text-[clamp(3rem,8vw,7rem)] font-light leading-none'>
                  Manage the public site without touching code.
                </h2>
              </section>
              <div className='grid gap-5 md:grid-cols-3'>
                {[
                  ['Total projects', content.projects.length],
                  ['Active categories', categories.length],
                  ['Last updated', lastUpdated],
                ].map(([label, value]) => (
                  <article key={label} className='rounded bg-secondary p-6'>
                    <p className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
                      {label}
                    </p>
                    <p className='mt-8 text-4xl font-light'>{value}</p>
                  </article>
                ))}
              </div>
              <section className='grid gap-5 lg:grid-cols-[0.7fr_0.3fr]'>
                <div className='rounded bg-secondary p-6'>
                  <p className='mb-4 text-xs uppercase tracking-[0.16em] text-muted-foreground'>
                    Hero background media
                  </p>
                  <MediaUploader onUpload={uploadHeroMedia} compact />
                </div>
                <div className='rounded bg-foreground p-6 text-background'>
                  <Globe2 size={24} strokeWidth={1.5} />
                  <p className='mt-8 text-sm text-background/60'>
                    Current hero
                  </p>
                  <p className='mt-2 break-all text-lg'>
                    {content.home.heroMedia?.src || 'Generated background'}
                  </p>
                </div>
              </section>
            </div>
          ) : null}

          {activeView === 'projects' ? (
            <div className='grid gap-6 xl:grid-cols-[0.38fr_0.62fr]'>
              <section className='rounded bg-secondary p-5'>
                <div className='mb-5 flex items-center justify-between'>
                  <h2 className='text-3xl font-light'>Projects</h2>
                  <button
                    type='button'
                    onClick={() => setActiveView('add')}
                    className='rounded-full bg-foreground px-4 py-2 text-sm text-background'
                  >
                    Add new
                  </button>
                </div>
                <div className='grid gap-3'>
                  {content.projects.map((project, index) => (
                    <button
                      key={project.slug}
                      type='button'
                      onClick={() => setSelectedProjectIndex(index)}
                      className={`rounded border p-4 text-left transition ${
                        selectedProjectIndex === index
                          ? 'border-foreground bg-background'
                          : 'border-border hover:bg-background'
                      }`}
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <p className='text-xl font-light'>{project.title}</p>
                          <p className='mt-2 text-sm text-muted-foreground'>
                            {project.services}
                          </p>
                        </div>
                        <span className='rounded-full border border-border px-3 py-1 text-xs'>
                          {project.year}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
              <div>
                <ProjectForm
                  title={selectedProject.title || 'Untitled project'}
                  project={selectedProject}
                  filters={content.work.filters}
                  onUpload={uploadMedia}
                  onChange={project =>
                    updateProject(selectedProjectIndex, project)
                  }
                />
                <button
                  type='button'
                  onClick={() => removeProject(selectedProjectIndex)}
                  className='mt-4 text-sm uppercase tracking-[0.16em] text-muted-foreground'
                >
                  Remove project
                </button>
              </div>
            </div>
          ) : null}

          {activeView === 'pages' ? (
            <div className='grid gap-6 xl:grid-cols-2'>
              <SectionCard title='Home page' eyebrow='Hero and intro'>
                <Field label='Hero headline'>
                  <TextInput
                    value={content.home.headline}
                    onChange={event =>
                      updateSection('home', 'headline', event.target.value)
                    }
                  />
                </Field>
                <Field label='Hero subhead, line 1'>
                  <TextInput
                    value={content.home.heroSubhead[0] || ''}
                    onChange={event =>
                      updateSection('home', 'heroSubhead', [
                        event.target.value,
                        content.home.heroSubhead[1] || '',
                      ])
                    }
                  />
                </Field>
                <Field label='Hero subhead, line 2'>
                  <TextInput
                    value={content.home.heroSubhead[1] || ''}
                    onChange={event =>
                      updateSection('home', 'heroSubhead', [
                        content.home.heroSubhead[0] || '',
                        event.target.value,
                      ])
                    }
                  />
                </Field>
                <Field label='Main intro paragraph'>
                  <TextArea
                    value={content.home.intro}
                    onChange={event =>
                      updateSection('home', 'intro', event.target.value)
                    }
                  />
                </Field>
                <Field label='Small text above About me'>
                  <TextArea
                    value={content.home.supportingText}
                    onChange={event =>
                      updateSection(
                        'home',
                        'supportingText',
                        event.target.value,
                      )
                    }
                  />
                </Field>
                <Field label='Domain label'>
                  <TextInput
                    value={content.home.recentLabel}
                    onChange={event =>
                      updateSection('home', 'recentLabel', event.target.value)
                    }
                  />
                </Field>
              </SectionCard>

              <SectionCard title='About page' eyebrow='Profile text'>
                <Field label='Headline'>
                  <TextInput
                    value={content.about.headline}
                    onChange={event =>
                      updateSection('about', 'headline', event.target.value)
                    }
                  />
                </Field>
                <Field label='Intro'>
                  <TextArea
                    value={content.about.intro}
                    onChange={event =>
                      updateSection('about', 'intro', event.target.value)
                    }
                  />
                </Field>
                <Field label='Body'>
                  <TextArea
                    value={content.about.body}
                    onChange={event =>
                      updateSection('about', 'body', event.target.value)
                    }
                  />
                </Field>
                <div className='grid gap-4'>
                  <p className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
                    Service rows
                  </p>
                  {content.about.services.map((service, index) => (
                    <div
                      key={service.kicker}
                      className='grid gap-3 rounded border border-border bg-background p-4'
                    >
                      <TextInput
                        value={service.title}
                        onChange={event =>
                          updateAboutService(index, 'title', event.target.value)
                        }
                        placeholder='Service title'
                      />
                      <TextArea
                        value={service.description}
                        onChange={event =>
                          updateAboutService(
                            index,
                            'description',
                            event.target.value,
                          )
                        }
                        placeholder='Service description'
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title='Work page' eyebrow='Archive'>
                <Field label='Headline'>
                  <TextArea
                    value={content.work.headline}
                    onChange={event =>
                      updateSection('work', 'headline', event.target.value)
                    }
                  />
                </Field>
                <Field label='Filters, comma separated'>
                  <TextInput
                    value={content.work.filters.join(', ')}
                    onChange={event => updateFilters(event.target.value)}
                  />
                </Field>
                <Field label='Archive count'>
                  <TextInput
                    value={content.work.archiveCount}
                    onChange={event =>
                      updateSection(
                        'work',
                        'archiveCount',
                        Number(event.target.value) || 0,
                      )
                    }
                  />
                </Field>
              </SectionCard>

              <SectionCard title='Contact page' eyebrow='Form and copy'>
                <Field label='Headline'>
                  <TextArea
                    value={content.contact.headline}
                    onChange={event =>
                      updateSection('contact', 'headline', event.target.value)
                    }
                  />
                </Field>
                <div className='grid gap-4'>
                  <p className='text-xs uppercase tracking-[0.16em] text-muted-foreground'>
                    Form fields
                  </p>
                  {content.contact.formFields.map((field, index) => (
                    <div
                      key={`${field.label}-${index}`}
                      className='grid gap-3 rounded border border-border bg-background p-4'
                    >
                      <TextInput
                        value={field.label}
                        onChange={event =>
                          updateFormField(index, 'label', event.target.value)
                        }
                        placeholder='Field label'
                      />
                      <TextInput
                        value={field.placeholder}
                        onChange={event =>
                          updateFormField(
                            index,
                            'placeholder',
                            event.target.value,
                          )
                        }
                        placeholder='Placeholder text'
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          ) : null}

          {activeView === 'add' ? (
            <div>
              <ProjectForm
                title='New project'
                project={newProject}
                filters={content.work.filters}
                onUpload={uploadMedia}
                onChange={setNewProject}
              />
              <button
                type='button'
                onClick={addProject}
                className='mt-5 rounded-full bg-foreground px-8 py-4 text-background'
              >
                Add project to draft
              </button>
            </div>
          ) : null}

          {activeView === 'media' ? (
            <div className='grid gap-6'>
              <section className='grid gap-5 rounded bg-secondary p-6 lg:grid-cols-[0.45fr_0.55fr] lg:p-8'>
                <div>
                  <p className='text-xs uppercase tracking-[0.18em] text-muted-foreground'>
                    Media Library
                  </p>
                  <h2 className='mt-3 text-[clamp(3rem,7vw,6rem)] font-light leading-none'>
                    Uploaded files
                  </h2>
                  <p className='mt-5 max-w-xl text-muted-foreground'>
                    Files are stored in `public/images/` and served publicly
                    from `/images/file-name`. Delete removes the repository file
                    and clears draft references.
                  </p>
                </div>
                <MediaUploader
                  onUpload={async file => {
                    await uploadMedia(file);
                    await loadMediaFiles();
                  }}
                  compact
                />
              </section>

              <section className='rounded bg-secondary p-5'>
                <div className='mb-5 flex flex-wrap items-center justify-between gap-4'>
                  <h3 className='text-3xl font-light'>Repository media</h3>
                  <button
                    type='button'
                    onClick={loadMediaFiles}
                    className='rounded-full border border-border px-5 py-2 text-sm'
                  >
                    Refresh
                  </button>
                </div>

                {loadingMedia ? (
                  <div className='min-h-40 flex items-center justify-center text-muted-foreground'>
                    <Loader2 size={22} className='mr-2 animate-spin' />
                    Loading media
                  </div>
                ) : null}

                {!loadingMedia && !mediaFiles.length ? (
                  <div className='min-h-40 grid place-items-center rounded border border-border bg-background p-8 text-center text-muted-foreground'>
                    No uploaded media found in `public/images/`.
                  </div>
                ) : null}

                <div className='grid gap-3'>
                  {mediaFiles.map(file => {
                    const usage = getMediaUsage(content, file.path);
                    const isDeleting = deletingMediaPath === file.path;

                    return (
                      <article
                        key={file.path}
                        className='grid gap-4 rounded border border-border bg-background p-4 md:grid-cols-[1fr_auto]'
                      >
                        <div className='min-w-0'>
                          <div className='flex items-center gap-3'>
                            <span className='size-10 grid shrink-0 place-items-center rounded bg-secondary'>
                              <ImageIcon size={18} strokeWidth={1.5} />
                            </span>
                            <div className='min-w-0'>
                              <p className='truncate text-lg font-light'>
                                {file.name}
                              </p>
                              <p className='truncate text-sm text-muted-foreground'>
                                {file.path} · {formatBytes(file.size)}
                              </p>
                            </div>
                          </div>
                          <div className='mt-4 flex flex-wrap gap-2'>
                            {usage.length ? (
                              usage.map(item => (
                                <span
                                  key={item}
                                  className='rounded-full border border-border px-3 py-1 text-xs'
                                >
                                  Used: {item}
                                </span>
                              ))
                            ) : (
                              <span className='rounded-full border border-border px-3 py-1 text-xs text-muted-foreground'>
                                Not referenced in current draft
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={() => deleteMedia(file.path)}
                          disabled={isDeleting}
                          className='inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground transition hover:border-foreground hover:text-foreground disabled:opacity-60'
                        >
                          {isDeleting ? (
                            <Loader2 size={16} className='animate-spin' />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          ) : null}

          {activeView === 'settings' ? (
            <div className='grid gap-6 xl:grid-cols-2'>
              <section className='rounded bg-secondary p-6 lg:p-8'>
                <h2 className='mb-8 text-4xl font-light'>Contact details</h2>
                <div className='grid gap-5'>
                  <Field label='Email'>
                    <TextInput
                      value={content.site.email}
                      onChange={event =>
                        updateSite('email', event.target.value)
                      }
                    />
                  </Field>
                  <Field label='Phone'>
                    <TextInput
                      value={content.site.phone}
                      onChange={event =>
                        updateSite('phone', event.target.value)
                      }
                    />
                  </Field>
                  <Field label='Location'>
                    <TextInput
                      value={content.site.location}
                      onChange={event =>
                        updateSite('location', event.target.value)
                      }
                    />
                  </Field>
                  <Field label='YouTube URL'>
                    <TextInput
                      value={content.socialLinks[0]?.href || '#'}
                      onChange={event =>
                        updateYoutube('href', event.target.value)
                      }
                    />
                  </Field>
                </div>
              </section>

              <section className='rounded bg-secondary p-6 lg:p-8'>
                <h2 className='mb-8 text-4xl font-light'>Navigation & hero</h2>
                <div className='grid gap-5'>
                  <Field label='Work filters, comma separated'>
                    <TextInput
                      value={content.work.filters.join(', ')}
                      onChange={event => updateFilters(event.target.value)}
                    />
                  </Field>
                  <Field label='Hero headline'>
                    <TextInput
                      value={content.home.headline}
                      onChange={event =>
                        setContent(current => ({
                          ...current,
                          home: {
                            ...current.home,
                            headline: event.target.value,
                          },
                        }))
                      }
                    />
                  </Field>
                  <Field label='Hero supporting text'>
                    <TextArea
                      value={content.home.supportingText}
                      onChange={event =>
                        setContent(current => ({
                          ...current,
                          home: {
                            ...current.home,
                            supportingText: event.target.value,
                          },
                        }))
                      }
                    />
                  </Field>
                  <div>
                    <p className='mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground'>
                      Hero media
                    </p>
                    <MediaUploader onUpload={uploadHeroMedia} compact />
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
