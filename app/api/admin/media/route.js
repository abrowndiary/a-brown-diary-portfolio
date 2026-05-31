import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { isSameOriginRequest } from '@/app/_lib/admin-security';
import { isValidSession } from '@/app/_lib/admin-session';
import { siteContent } from '@/content';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'mp4',
  'webm',
  'mov',
]);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

function getRepoConfig() {
  const [owner, repo] = (
    process.env.GITHUB_REPO || 'abrowndiary/A-Brown-Diary-portfolio'
  ).split('/');

  return {
    owner,
    repo,
    branch: process.env.GITHUB_BRANCH || 'main',
    token: process.env.GITHUB_TOKEN,
  };
}

function getGithubHeaders(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getExtension(name) {
  return name.split('.').pop()?.toLowerCase() || '';
}

function getMediaType(type, name) {
  const extension = getExtension(name);
  return type.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(extension)
    ? 'video'
    : 'image';
}

function validateFile(file) {
  const extension = getExtension(file.name || '');

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return 'Unsupported file extension.';
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return 'Unsupported media type.';
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'File is too large. Maximum upload size is 50 MB.';
  }

  return null;
}

function normalizePublicPath(path) {
  if (!path || typeof path !== 'string') {
    return null;
  }

  if (!path.startsWith('/images/')) {
    return null;
  }

  const filename = path.replace('/images/', '');

  if (!filename || filename.includes('/') || filename.includes('..')) {
    return null;
  }

  return {
    filename,
    repoPath: `public/images/${filename}`,
    publicPath: `/images/${filename}`,
  };
}

async function getGithubFile({ owner, repo, branch, token, path }) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: getGithubHeaders(token) },
  );

  if (!response.ok) {
    return { response, data: null };
  }

  return { response, data: await response.json() };
}

export async function GET() {
  if (!isValidSession(cookies())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { owner, repo, branch, token } = getRepoConfig();

  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN is not configured.' },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/public/images?ref=${branch}`,
    { headers: getGithubHeaders(token) },
  );

  if (response.status === 404) {
    return NextResponse.json({ files: [] });
  }

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: error.message || 'Could not list media files.' },
      { status: response.status },
    );
  }

  const files = await response.json();

  return NextResponse.json({
    files: files
      .filter(file => file.type === 'file')
      .map(file => ({
        name: file.name,
        path: `/images/${file.name}`,
        size: file.size,
        sha: file.sha,
        type: getMediaType('', file.name),
      })),
  });
}

export async function POST(request) {
  if (!isValidSession(cookies())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden request.' }, { status: 403 });
  }

  const { owner, repo, branch, token } = getRepoConfig();
  const activeProvider = siteContent.mediaStorage?.activeProvider || 'github';

  if (activeProvider !== 'github') {
    return NextResponse.json(
      {
        error:
          'Direct uploads are currently available only for GitHub repository storage.',
      },
      { status: 400 },
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN is not configured.' },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const validationError = validateFile(file);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const safeName = sanitizeFilename(file.name || 'media-file');
  const filename = `${Date.now()}-${safeName}`;
  const repoPath = `public/images/${filename}`;
  const publicPath = `/images/${filename}`;
  const arrayBuffer = await file.arrayBuffer();
  const content = Buffer.from(arrayBuffer).toString('base64');
  const uploadResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`,
    {
      method: 'PUT',
      headers: getGithubHeaders(token),
      body: JSON.stringify({
        branch,
        content,
        message: `Upload ${filename}`,
      }),
    },
  );

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json();
    return NextResponse.json(
      { error: error.message || 'Media upload failed.' },
      { status: uploadResponse.status },
    );
  }

  return NextResponse.json({
    path: publicPath,
    type: getMediaType(file.type || '', file.name),
  });
}

export async function DELETE(request) {
  if (!isValidSession(cookies())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden request.' }, { status: 403 });
  }

  const { path } = await request.json();
  const normalizedPath = normalizePublicPath(path);

  if (!normalizedPath) {
    return NextResponse.json({ error: 'Invalid media path.' }, { status: 400 });
  }

  const { owner, repo, branch, token } = getRepoConfig();

  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN is not configured.' },
      { status: 500 },
    );
  }

  const { response: fileResponse, data: fileData } = await getGithubFile({
    owner,
    repo,
    branch,
    token,
    path: normalizedPath.repoPath,
  });

  if (!fileResponse.ok) {
    return NextResponse.json(
      { error: 'Could not find media file in GitHub.' },
      { status: fileResponse.status },
    );
  }

  const deleteResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${normalizedPath.repoPath}`,
    {
      method: 'DELETE',
      headers: getGithubHeaders(token),
      body: JSON.stringify({
        branch,
        message: `Delete ${normalizedPath.filename}`,
        sha: fileData.sha,
      }),
    },
  );

  if (!deleteResponse.ok) {
    const error = await deleteResponse.json();
    return NextResponse.json(
      { error: error.message || 'Media deletion failed.' },
      { status: deleteResponse.status },
    );
  }

  return NextResponse.json({ deleted: true, path: normalizedPath.publicPath });
}
