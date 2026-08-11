import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const hostname = new URL(context.request.url).hostname;

  // 本番ドメインだけ認証なし
  const PUBLIC_HOSTS = new Set(['junya03.com', 'www.junya03.com']);

  if (PUBLIC_HOSTS.has(hostname)) {
    return next();
  }

  const authorizationHeader =
    context.request.headers.get('authorization') || '';

  if (!authorizationHeader.startsWith('Basic ')) {
    return unauthorized();
  }

  try {
    const basic = authorizationHeader.split(' ')[1] || '';
    const decoded = atob(basic);
    const idx = decoded.indexOf(':');

    if (idx === -1) {
      return unauthorized();
    }

    const user = decoded.slice(0, idx);
    const password = decoded.slice(idx + 1);

    if (
      user === import.meta.env.BASIC_AUTH_USER &&
      password === import.meta.env.BASIC_AUTH_PASSWORD
    ) {
      return next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
};

function unauthorized() {
  return new Response('Basic Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
