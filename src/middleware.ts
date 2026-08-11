import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Preview環境だけBasic認証
  if (import.meta.env.VERCEL_ENV !== 'preview') {
    return next();
  }

  const authorizationHeader = context.request.headers.get('authorization');

  if (!authorizationHeader?.startsWith('Basic ')) {
    return unauthorized();
  }

  try {
    const encoded = authorizationHeader.slice(6);
    const decoded = atob(encoded);

    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex === -1) {
      return unauthorized();
    }

    const user = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

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
