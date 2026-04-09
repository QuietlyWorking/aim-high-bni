// CF Pages Function: POST /api/testimonial
// Handles testimonial form submissions from member profile pages.
// Writes to a pending_testimonials table for review before publishing.

interface Env {
  QNT_SERVICE_ROLE_KEY: string;
}

const QNT_URL = "https://caeiaprjizteokoenzad.supabase.co";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = await context.request.json() as Record<string, unknown>;

    const authorName = (body.author_name as string || "").trim();
    const message = (body.message as string || "").trim();

    if (!authorName || !message) {
      return new Response(
        JSON.stringify({ error: "Name and message are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message is too long (max 2000 characters)" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const headers = {
      apikey: context.env.QNT_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.QNT_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };

    const testimonialData = {
      organization_id: body.organization_id,
      author_name: authorName,
      quote: message,
      about_member_slug: body.about_member_slug,
      source: "website_form",
      status: "pending",
      is_featured: false,
    };

    const res = await fetch(`${QNT_URL}/rest/v1/chapter_testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify(testimonialData),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase error:", errText);
      return new Response(
        JSON.stringify({ error: "Submission failed. Please try again." }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Testimonial handler error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
