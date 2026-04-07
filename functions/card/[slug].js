// CF Pages Function: /card/:slug
// Serves OG meta tags for social sharing + logs click to QNT

const QNT_URL = "https://caeiaprjizteokoenzad.supabase.co";
const ORG_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

export async function onRequest(context) {
  const slug = context.params.slug;
  const url = new URL(context.request.url);
  const userAgent = context.request.headers.get("user-agent") || "";

  // Detect if this is a social bot (needs OG tags) or a human (needs tracking + redirect)
  const isBot = /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|TelegramBot|Pinterest/i.test(userAgent);

  // Fetch member data from QNT
  const memberResp = await fetch(
    `${QNT_URL}/rest/v1/members?slug=eq.${slug}&organization_id=eq.${ORG_ID}&status=eq.active&select=id,full_name,slug,business_name,profession_category,tagline,card_jpg_url,headshot_url&limit=1`,
    {
      headers: {
        apikey: context.env.QNT_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${context.env.QNT_SERVICE_ROLE_KEY}`,
      },
    }
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

  // Log click (non-blocking, don't wait for response)
  if (!isBot) {
    const referrer = context.request.headers.get("referer") || "";
    const ip = context.request.headers.get("cf-connecting-ip") || "";
    const country = context.request.headers.get("cf-ipcountry") || "";
    const utmSource = url.searchParams.get("utm_source") || "";
    const utmMedium = url.searchParams.get("utm_medium") || "";
    const utmCampaign = url.searchParams.get("utm_campaign") || "";

    // Detect device type from user agent
    let deviceType = "desktop";
    if (/mobile|android|iphone/i.test(userAgent)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";

    // Fire-and-forget click tracking
    context.waitUntil(
      fetch(`${QNT_URL}/rest/v1/card_clicks`, {
        method: "POST",
        headers: {
          apikey: context.env.QNT_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${context.env.QNT_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          organization_id: ORG_ID,
          member_id: member.id,
          member_slug: slug,
          referrer: referrer.substring(0, 500),
          user_agent: userAgent.substring(0, 500),
          ip_address: ip,
          country: country,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          device_type: deviceType,
        }),
      }).catch(() => {}) // Silently fail — tracking should never break the page
    );
  }

  // Serve HTML with OG tags + card display + CTA
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}">

  <!-- Open Graph (Facebook, LinkedIn, Discord, Slack) -->
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escHtml(title)}">
  <meta property="og:description" content="${escHtml(description)}">
  <meta property="og:image" content="${escHtml(cardImage)}">
  <meta property="og:image:width" content="1050">
  <meta property="og:image:height" content="600">
  <meta property="og:url" content="https://aimhighbni.com/card/${escHtml(slug)}">
  <meta property="og:site_name" content="Aim High BNI">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escHtml(title)}">
  <meta name="twitter:description" content="${escHtml(description)}">
  <meta name="twitter:image" content="${escHtml(cardImage)}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f5f5f5; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
    .card-container { max-width: 560px; width: 100%; }
    .card-img { width: 100%; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
    .actions { display: flex; gap: 12px; margin-top: 20px; justify-content: center; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; }
    .btn-primary { background: #c41230; color: white; }
    .btn-primary:hover { background: #a00f28; }
    .btn-secondary { background: white; color: #1a1a1a; border: 1px solid #ddd; }
    .btn-secondary:hover { background: #f0f0f0; }
    .copied { background: #22c55e !important; color: white !important; border-color: #22c55e !important; }
    .branding { margin-top: 24px; text-align: center; }
    .branding a { color: #999; font-size: 12px; text-decoration: none; }
    .branding a:hover { color: #c41230; }
  </style>
</head>
<body>
  <div class="card-container">
    ${cardImage ? `<img src="${escHtml(cardImage)}" alt="${escHtml(member.full_name)}" class="card-img">` : ''}
    <div class="actions">
      <a href="https://aimhighbni.com/visit?ref=${escHtml(slug)}" class="btn btn-primary">
        Visit a Meeting
      </a>
      <a href="https://aimhighbni.com/members/${escHtml(slug)}" class="btn btn-secondary">
        View Full Profile
      </a>
      <button onclick="copyLink()" id="copyBtn" class="btn btn-secondary">
        Copy Card Link
      </button>
    </div>
    <div class="branding">
      <a href="https://aimhighbni.com">aimhighbni.com</a>
    </div>
  </div>
  <script>
    function copyLink() {
      navigator.clipboard.writeText('https://aimhighbni.com/card/${slug}').then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy Card Link'; btn.classList.remove('copied'); }, 2000);
      });
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": isBot ? "public, max-age=3600" : "no-cache",
    },
  });
}

function escHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
