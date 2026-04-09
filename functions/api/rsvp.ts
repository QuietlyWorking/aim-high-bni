// CF Pages Function: POST /api/rsvp
// Handles visitor RSVP form submissions from the website.
// Writes to the Supabase visitors table using the service role key.

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

    // Validate required fields
    const fullName = (body.full_name as string || "").trim();
    const email = (body.email as string || "").trim().toLowerCase();

    if (!fullName || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const headers = {
      apikey: context.env.QNT_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${context.env.QNT_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };

    // Split name into first/last
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const visitorData = {
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
    };

    const res = await fetch(`${QNT_URL}/rest/v1/visitors`, {
      method: "POST",
      headers,
      body: JSON.stringify(visitorData),
    });

    if (!res.ok) {
      const errText = await res.text();
      // Check for duplicate (unique constraint on email + org)
      if (errText.includes("duplicate") || errText.includes("unique")) {
        return new Response(
          JSON.stringify({ success: true, message: "Already registered" }),
          { status: 200, headers: corsHeaders }
        );
      }
      console.error("Supabase error:", errText);
      return new Response(
        JSON.stringify({ error: "Registration failed. Please try again." }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("RSVP handler error:", err);
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
