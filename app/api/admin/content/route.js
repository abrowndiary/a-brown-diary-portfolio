import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { isSameOriginRequest } from '@/app/_lib/admin-security';
import { isValidSession } from '@/app/_lib/admin-session';
import { siteContent } from '@/content';

const CONTENT_PATH = 'app/_content/site-content.json';

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

export async function GET() {
  if (!isValidSession(cookies())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(siteContent);
}

export async function PUT(request) {
  if (!isValidSession(cookies())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden request.' }, { status: 403 });
  }

  const nextContent = await request.json();
  const { owner, repo, branch, token } = getRepoConfig();

  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN is not configured.' },
      { status: 500 },
    );
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${CONTENT_PATH}?ref=${branch}`;
  const currentFileResponse = await fetch(fileUrl, { headers });

  if (!currentFileResponse.ok) {
    return NextResponse.json(
      { error: 'Could not read current content file from GitHub.' },
      { status: currentFileResponse.status },
    );
  }

  const currentFile = await currentFileResponse.json();
  const content = Buffer.from(JSON.stringify(nextContent, null, 2)).toString(
    'base64',
  );
  const updateResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${CONTENT_PATH}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        branch,
        content,
        message: 'Update editable site content',
        sha: currentFile.sha,
      }),
    },
  );

  if (!updateResponse.ok) {
    const error = await updateResponse.json();
    return NextResponse.json(
      { error: error.message || 'GitHub publish failed.' },
      { status: updateResponse.status },
    );
  }

  return NextResponse.json({ published: true });
}
