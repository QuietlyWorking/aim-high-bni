// CF Pages Function: /card/:slug
// Landing page for shared business cards. Serves OG meta tags for social
// previews and tracks clicks with sharer attribution via ?s= token.
//
// Flow: Member shares card from QNT → QNT creates card_shares record with
// unique token → link is aimhighbni.com/card/paul-banagas?s=x7k9m2 →
// click lands here → we log who shared it, whose card, referrer, device.

const QNT_URL = "https://caeiaprjizteokoenzad.supabase.co";
const ORG_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

export async function onRequest(context) {
  const slug = context.params.slug;
  const url = new URL(context.request.url);
  const userAgent = context.request.headers.get("user-agent") || "";
  const shareToken = url.searchParams.get("s") || null;

  const isBot = /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|TelegramBot|Pinterest/i.test(userAgent);

  const headers = {
    apikey: context.env.QNT_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${context.env.QNT_SERVICE_ROLE_KEY}`,
  };

  // Fetch member data
  const memberResp = await fetch(
    `${QNT_URL}/rest/v1/members?slug=eq.${slug}&organization_id=eq.${ORG_ID}&status=eq.active&select=id,full_name,slug,business_name,profession_category,tagline,card_jpg_url,headshot_url&limit=1`,
    { headers }
  );
  const members = await memberResp.json();

  if (!members || members.length === 0) {
    return Response.redirect(`https://aimhighbni.com/members`, 302);
  }

  const member = members[0];
  const cardImage = member.card_jpg_url || member.headshot_url || "";
  const title = `${member.full_name} — Aim High BNI`;
  const description = [member.profession_category, member.business_name, member.tagline]
    .filter(Boolean)
    .join(" | ") || "Aim High BNI Member";

  // Look up share token for attribution (if present)
  let sharedByMemberId = null;
  if (shareToken) {
    const shareResp = await fetch(
      `${QNT_URL}/rest/v1/card_shares?token=eq.${shareToken}&select=shared_by_member_id&limit=1`,
      { headers }
    );
    const shares = await shareResp.json();
    if (shares && shares.length > 0) {
      sharedByMemberId = shares[0].shared_by_member_id;
    }
  }

  // Log click (non-blocking)
  if (!isBot) {
    const referrer = context.request.headers.get("referer") || "";
    const ip = context.request.headers.get("cf-connecting-ip") || "";
    const country = context.request.headers.get("cf-ipcountry") || "";
    const utmSource = url.searchParams.get("utm_source") || "";
    const utmMedium = url.searchParams.get("utm_medium") || "";
    const utmCampaign = url.searchParams.get("utm_campaign") || "";

    let deviceType = "desktop";
    if (/mobile|android|iphone/i.test(userAgent)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";

    // Log click with sharer attribution
    const clickPromise = fetch(`${QNT_URL}/rest/v1/card_clicks`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        organization_id: ORG_ID,
        member_id: member.id,
        member_slug: slug,
        share_token: shareToken,
        shared_by_member_id: sharedByMemberId,
        referrer: referrer.substring(0, 500),
        user_agent: userAgent.substring(0, 500),
        ip_address: ip,
        country: country,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        device_type: deviceType,
      }),
    }).catch(() => {});

    // Increment click_count on card_shares (if token exists)
    const updatePromise = shareToken
      ? fetch(
          `${QNT_URL}/rest/v1/card_shares?token=eq.${shareToken}`,
          {
            method: "PATCH",
            headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify({
              click_count: sharedByMemberId ? undefined : undefined, // handled by RPC below
              last_clicked_at: new Date().toISOString(),
            }),
          }
        ).catch(() => {})
      : Promise.resolve();

    // Increment click_count atomically
    const incrPromise = shareToken
      ? fetch(
          `${QNT_URL}/rest/v1/rpc/increment_card_share_clicks`,
          {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ token_param: shareToken }),
          }
        ).catch(() => {})
      : Promise.resolve();

    context.waitUntil(Promise.all([clickPromise, updatePromise, incrPromise]));
  }

  // Serve HTML with OG tags + card display + CTAs
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">

  <!-- Open Graph -->
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(cardImage)}">
  <meta property="og:image:width" content="1050">
  <meta property="og:image:height" content="600">
  <meta property="og:url" content="https://aimhighbni.com/card/${esc(slug)}">
  <meta property="og:site_name" content="Aim High BNI">

  <!-- Twitter Card -->
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
    ${cardImage ? `<img src="${esc(cardImage)}" alt="${esc(member.full_name)}" class="card-img">` : ''}
    <div class="actions">
      <a href="https://aimhighbni.com/visit?ref=${esc(slug)}" class="btn btn-primary">
        Visit a Meeting
      </a>
      <a href="https://aimhighbni.com/members/${esc(slug)}" class="btn btn-secondary">
        View Full Profile
      </a>
    </div>
    <div class="branding">
      <a href="https://aimhighbni.com">aimhighbni.com</a>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": isBot ? "public, max-age=3600" : "no-cache",
    },
  });
}

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
