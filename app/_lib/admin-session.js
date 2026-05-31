import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'abd_owner_session';

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '';
}

function sign(value) {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

export function createSessionValue() {
  const expires = Date.now() + 1000 * 60 * 60 * 12;
  const payload = String(expires);

  return `${payload}.${sign(payload)}`;
}

export function isValidSession(cookieStore) {
  const secret = getSecret();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!secret || !session) {
    return false;
  }

  const [expires, signature] = session.split('.');

  if (!expires || !signature || Number(expires) < Date.now()) {
    return false;
  }

  const expected = sign(expires);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

export function setSessionCookie(response, value) {
  response.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
