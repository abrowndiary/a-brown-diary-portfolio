import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { isValidSession } from '@/app/_lib/admin-session';

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

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getMediaType(type) {
  return type.startsWith('video/') ? 'video' : 'image';
}

export async function POST(request) {
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

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const safeName = sanitizeFilename(file.name || 'media-file');
  const filename = `${Date.now()}-${safeName}`;
  const repoPath = `public/images/${filename}`;
  const publicPath = `/images/${filename}`;
  const arrayBuffer = await file.arrayBuffer();
  const content = Buffer.from(arrayBuffer).toString('base64');
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const uploadResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`,
    {
      method: 'PUT',
      headers,
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
    type: getMediaType(file.type || ''),
  });
}
