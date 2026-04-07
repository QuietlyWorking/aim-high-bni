const CANONICAL_HOST = 'aimhighbni.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname;

  // Allow preview deployments and local dev
  if (host.endsWith('.pages.dev') || host === 'localhost' || host === '127.0.0.1') {
    return context.next();
  }

  // Redirect non-canonical hosts (www, .com variants) to canonical
  if (host !== CANONICAL_HOST) {
    return Response.redirect(
      `https://${CANONICAL_HOST}${url.pathname}${url.search}`,
      301
    );
  }

  return context.next();
}
