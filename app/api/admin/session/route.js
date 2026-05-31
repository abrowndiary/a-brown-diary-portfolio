import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
  const { password } = await request.json();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured.' },
      { status: 500 },
    );
  }

  if (password !== configuredPassword) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  setSessionCookie(response, createSessionValue());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  clearSessionCookie(response);
  return response;
}
