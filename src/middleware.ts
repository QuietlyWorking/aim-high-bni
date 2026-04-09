import { defineMiddleware } from "astro:middleware";
import { fetchOrgByDomain } from "@/lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get("host") || "localhost";

  const chapter = await fetchOrgByDomain(host);

  if (!chapter) {
    // No matching org — return 404 with a basic message
    return new Response("Chapter not found", { status: 404 });
  }

  context.locals.chapter = chapter;

  return next();
});
