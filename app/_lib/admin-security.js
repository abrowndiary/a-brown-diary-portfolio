const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

const loginAttempts = globalThis.__abdLoginAttempts || new Map();
globalThis.__abdLoginAttempts = loginAttempts;

export function getClientKey(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}

export function getLoginStatus(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { locked: false, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      locked: true,
      retryAfter: Math.ceil((record.lockedUntil - now) / 1000),
      remainingAttempts: 0,
    };
  }

  if (record.firstAttemptAt + LOGIN_WINDOW_MS < now) {
    loginAttempts.delete(key);
    return { locked: false, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  return {
    locked: false,
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - record.count),
  };
}

export function recordFailedLogin(key) {
  const now = Date.now();
  const existing = loginAttempts.get(key);
  const record =
    existing && existing.firstAttemptAt + LOGIN_WINDOW_MS > now
      ? existing
      : { count: 0, firstAttemptAt: now, lockedUntil: 0 };

  record.count += 1;

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOGIN_LOCK_MS;
  }

  loginAttempts.set(key, record);
  return getLoginStatus(key);
}

export function clearFailedLogins(key) {
  loginAttempts.delete(key);
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const fetchSite = request.headers.get('sec-fetch-site');

  if (fetchSite === 'cross-site') {
    return false;
  }

  if (!origin) {
    return true;
  }

  return origin === requestOrigin;
}
