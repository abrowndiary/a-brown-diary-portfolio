import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  clearFailedLogins,
  getClientKey,
  getLoginStatus,
  isSameOriginRequest,
  recordFailedLogin,
} from '@/app/_lib/admin-security';
import {
  clearSessionCookie,
  createSessionValue,
  isValidSession,
  setSessionCookie,
} from '@/app/_lib/admin-session';

export async function GET() {
  return NextResponse.json({ authenticated: isValidSession(cookies()) });
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden request.' }, { status: 403 });
  }

  const clientKey = getClientKey(request);
  const loginStatus = getLoginStatus(clientKey);

  if (loginStatus.locked) {
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${loginStatus.retryAfter} seconds.`,
      },
      { status: 429 },
    );
  }

  const { password } = await request.json();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured.' },
      { status: 500 },
    );
  }

  if (password !== configuredPassword) {
    const status = recordFailedLogin(clientKey);

    return NextResponse.json(
      {
        error: 'Invalid password.',
        remainingAttempts: status.remainingAttempts,
      },
      { status: status.locked ? 429 : 401 },
    );
  }

  clearFailedLogins(clientKey);
  const response = NextResponse.json({ authenticated: true });
  setSessionCookie(response, createSessionValue());
  return response;
}

export async function DELETE(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden request.' }, { status: 403 });
  }

  const response = NextResponse.json({ authenticated: false });
  clearSessionCookie(response);
  return response;
}
