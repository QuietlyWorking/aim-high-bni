import type { APIRoute } from "astro";

const QNT_URL = "https://caeiaprjizteokoenzad.supabase.co";

export const GET: APIRoute = async ({ params, request, locals }) => {
  const slug = params.slug;
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const shareToken = url.searchParams.get("s") || null;

  const isBot = /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|TelegramBot|Pinterest/i.test(userAgent);

  // Get service role key from runtime env
  const runtime = (locals as Record<string, unknown>).runtime as { env: Record<string, string> } | undefined;
  const serviceRoleKey = runtime?.env?.QNT_SERVICE_ROLE_KEY || import.meta.env.QNT_SERVICE_ROLE_KEY;
  const orgId = locals.chapter?.id || "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  if (!serviceRoleKey) {
    return Response.redirect(`https://aimhighbni.com/members`, 302);
  }

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };

  // Fetch member data
  const memberResp = await fetch(
    `${QNT_URL}/rest/v1/members?slug=eq.${slug}&organization_id=eq.${orgId}&status=eq.active&select=id,full_name,slug,business_name,profession_category,tagline,card_jpg_url,headshot_url&limit=1`,
    { headers }
  );
  const members = await memberResp.json() as Record<string, unknown>[];

  if (!members || members.length === 0) {
    return Response.redirect(`https://aimhighbni.com/members`, 302);
  }

  const member = members[0];
  const cardImage = (member.card_jpg_url || member.headshot_url || "") as string;
  const title = `${member.full_name} — Aim High BNI`;
  const description = [member.profession_category, member.business_name, member.tagline]
    .filter(Boolean)
    .join(" | ") || "Aim High BNI Member";

  // Look up share token for attribution
  let sharedByMemberId: string | null = null;
  if (shareToken) {
    const shareResp = await fetch(
      `${QNT_URL}/rest/v1/card_shares?token=eq.${shareToken}&select=shared_by_member_id&limit=1`,
      { headers }
    );
    const shares = await shareResp.json() as Record<string, unknown>[];
    if (shares && shares.length > 0) {
      sharedByMemberId = shares[0].shared_by_member_id as string;
    }
  }

  // Log click (non-blocking for non-bots)
  if (!isBot) {
    const referrer = request.headers.get("referer") || "";
    const ip = request.headers.get("cf-connecting-ip") || "";
    const country = request.headers.get("cf-ipcountry") || "";
    const utmSource = url.searchParams.get("utm_source") || "";
    const utmMedium = url.searchParams.get("utm_medium") || "";
    const utmCampaign = url.searchParams.get("utm_campaign") || "";

    let deviceType = "desktop";
    if (/mobile|android|iphone/i.test(userAgent)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";

    // Fire and forget: log click + update share stats
    fetch(`${QNT_URL}/rest/v1/card_clicks`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        organization_id: orgId,
        member_id: member.id,
        member_slug: slug,
        share_token: shareToken,
        shared_by_member_id: sharedByMemberId,
        referrer: (referrer as string).substring(0, 500),
        user_agent: userAgent.substring(0, 500),
        ip_address: ip,
        country: country,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        device_type: deviceType,
      }),
    }).catch(() => {});

    if (shareToken) {
      fetch(`${QNT_URL}/rest/v1/card_shares?token=eq.${shareToken}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ last_clicked_at: new Date().toISOString() }),
      }).catch(() => {});

      fetch(`${QNT_URL}/rest/v1/rpc/increment_card_share_clicks`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ token_param: shareToken }),
      }).catch(() => {});
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(cardImage)}">
  <meta property="og:image:width" content="1050">
  <meta property="og:image:height" content="600">
  <meta property="og:url" content="https://aimhighbni.com/card/${esc(slug!)}">
  <meta property="og:site_name" content="Aim High BNI">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(cardImage)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f5f5f5; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
    .card-container { max-width: 560px; width: 100%; }
    .card-img { width: 100%; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
    .actions { display: flex; gap: 12px; margin-top: 20px; justify-content: center; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .btn-primary { background: #c41230; color: white; }
    .btn-primary:hover { background: #a00f28; }
    .btn-secondary { background: white; color: #1a1a1a; border: 1px solid #ddd; }
    .btn-secondary:hover { background: #f0f0f0; }
    .branding { margin-top: 24px; text-align: center; }
    .branding a { color: #999; font-size: 12px; text-decoration: none; }
    .branding a:hover { color: #c41230; }
  </style>
</head>
<body>
  <div class="card-container">
    ${cardImage ? `<img src="${esc(cardImage)}" alt="${esc(member.full_name as string)}" class="card-img">` : ""}
    <div class="actions">
      <a href="https://aimhighbni.com/visit?ref=${esc(slug!)}" class="btn btn-primary">Visit a Meeting</a>
      <a href="https://aimhighbni.com/members/${esc(slug!)}" class="btn btn-secondary">View Full Profile</a>
    </div>
    <div class="branding"><a href="https://aimhighbni.com">aimhighbni.com</a></div>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": isBot ? "public, max-age=3600" : "no-cache",
    },
  });
};

function esc(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
