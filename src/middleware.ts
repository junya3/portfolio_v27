import { next } from '@vercel/edge';

export const config = {
  matcher: '/(.*)',
};

const PUBLIC_HOSTS = new Set(['junya03.com', 'www.junya03.com']);

export default function middleware(request: Request) {
  const hostname = new URL(request.url).hostname;

  // 本番ドメインだけ認証なし
  if (PUBLIC_HOSTS.has(hostname)) {
    return next();
  }

  const authorizationHeader = request.headers.get('authorization') || '';

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
      user === process.env.BASIC_AUTH_USER &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      return next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

function unauthorized() {
  return new Response('Basic Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
