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

    const fullName = (body.full_name as string || "").trim();
    const email = (body.email as string || "").trim().toLowerCase();

    if (!fullName || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), { status: 400, headers: corsHeaders });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Please enter a valid email address" }), { status: 400, headers: corsHeaders });
    }

    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };

    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const res = await fetch(`${QNT_URL}/rest/v1/visitors`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        organization_id: body.organization_id,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        email: email,
        phone: body.phone || null,
        business_name: body.business_name || null,
        industry: body.industry || null,
        source: "website",
        referred_by_slug: body.ref || null,
        status: "registered",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      if (errText.includes("duplicate") || errText.includes("unique")) {
        return new Response(JSON.stringify({ success: true, message: "Already registered" }), { status: 200, headers: corsHeaders });
      }
      return new Response(JSON.stringify({ error: "Registration failed. Please try again." }), { status: 500, headers: corsHeaders });
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
