import { defineMiddleware } from "astro:middleware";
import { createSupabaseClient, fetchOrgByDomain } from "@/lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get("host") || "localhost";

  // Access env vars from Cloudflare runtime context
  const runtime = (context.locals as Record<string, unknown>).runtime as { env: Record<string, string> } | undefined;
  const env = runtime?.env || {};

  const supabaseUrl = env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
  const fallbackOrgId = env.AIM_HIGH_ORG_ID || import.meta.env.AIM_HIGH_ORG_ID;

  if (!supabaseUrl || !supabaseKey) {
    return new Response("Server configuration error", { status: 500 });
  }

  const sb = createSupabaseClient(supabaseUrl, supabaseKey);
  const chapter = await fetchOrgByDomain(sb, host, fallbackOrgId);

  if (!chapter) {
    return new Response("Chapter not found", { status: 404 });
  }

  context.locals.chapter = chapter;
  (context.locals as Record<string, unknown>).supabase = sb;

  return next();
});
