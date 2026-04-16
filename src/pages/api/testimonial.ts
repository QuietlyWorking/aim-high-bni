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
    };

    // Resolve member slug to UUID
    const memberSlug = body.about_member_slug as string;
    const authorEmail = (body.author_email as string || "").trim() || null;
    let aboutMemberId: string | null = null;
    let authorMemberId: string | null = null;

    if (memberSlug) {
      const memberRes = await fetch(
        `${QNT_URL}/rest/v1/members?slug=eq.${encodeURIComponent(memberSlug)}&organization_id=eq.${encodeURIComponent(body.organization_id as string)}&select=id,testimonials_enabled&limit=1`,
        { headers },
      );
      if (memberRes.ok) {
        const members = await memberRes.json() as Array<{ id: string; testimonials_enabled: boolean }>;
        if (members.length > 0) {
          if (members[0].testimonials_enabled === false) {
            return new Response(
              JSON.stringify({ error: "Submissions are not being accepted for this member." }),
              { status: 403, headers: corsHeaders },
            );
          }
          aboutMemberId = members[0].id;
        }
      }
    }

    // Try to match author email to a chapter member (for reciprocal flow)
    if (authorEmail) {
      const authorRes = await fetch(
        `${QNT_URL}/rest/v1/members?email=eq.${encodeURIComponent(authorEmail)}&organization_id=eq.${encodeURIComponent(body.organization_id as string)}&select=id&limit=1`,
        { headers },
      );
      if (authorRes.ok) {
        const authors = await authorRes.json() as Array<{ id: string }>;
        if (authors.length > 0) authorMemberId = authors[0].id;
      }
    }

    const res = await fetch(`${QNT_URL}/rest/v1/chapter_testimonials`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        organization_id: body.organization_id,
        author_name: authorName,
        author_email: authorEmail,
        author_member_id: authorMemberId,
        quote: message,
        about_member_id: aboutMemberId,
        about_member_slug: memberSlug || null,
        source: "website_form",
        status: "pending",
        is_featured: false,
        is_public: false,
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
