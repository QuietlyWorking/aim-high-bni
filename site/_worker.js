// aimhighbni.com was deactivated on 2026-11-10 at TIG's word.
// Every address answers 410 Gone with no body, so browsers show their own standard message and search engines drop
// the pages. The previous site is kept on the branch archive/astro-site-2026-11-10.
export default {
  async fetch() {
    return new Response(null, {
      status: 410,
      headers: { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" },
    });
  },
};
