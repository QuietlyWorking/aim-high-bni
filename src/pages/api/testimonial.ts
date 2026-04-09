import type { APIRoute } from "astro";

const QNT_URL = "https://caeiaprjizteokoenzad.supabase.co";

export const POST: APIRoute = async ({ request, locals }) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const runtime = (locals as Record<string, unknown>).runtime as { env: Record<string, string> } | undefined;
    const serviceRoleKey = runtime?.env?.QNT_SERVICE_ROLE_KEY || import.meta.env.QNT_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: corsHeaders });
    }

    const body = await request.json() as Record<string, unknown>;

    const authorName = (body.author_name as string || "").trim();
    const message = (body.message as string || "").trim();

    if (!authorName || !message) {
      return new Response(JSON.stringify({ error: "Name and message are required" }), { status: 400, headers: corsHeaders });
    }

    if (message.length > 2000) {
      return new Response(JSON.stringify({ error: "Message is too long (max 2000 characters)" }), { status: 400, headers: corsHeaders });
    }

    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };

    const res = await fetch(`${QNT_URL}/rest/v1/chapter_testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        organization_id: body.organization_id,
        author_name: authorName,
        quote: message,
        about_member_slug: body.about_member_slug,
        source: "website_form",
        status: "pending",
        is_featured: false,
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Submission failed. Please try again." }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch {
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), { status: 500, headers: corsHeaders });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
