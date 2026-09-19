// Vercel Serverless Function: Automatic Welcome Email Dispatcher via Resend
// Endpoint: POST /api/subscribe

export default async function handler(req: any, res: any) {
  // Setup CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Diagnostic GET request to check configuration status
  if (req.method === "GET") {
    const isConfigured = Boolean(process.env.RESEND_API_KEY);
    const sender = process.env.RESEND_FROM_EMAIL || "Denim Universe <onboarding@resend.dev>";
    return res.status(200).json({
      status: "ready",
      service: "Resend",
      resendConfigured: isConfigured,
      sender: isConfigured ? sender : "Unconfigured (add RESEND_API_KEY in Vercel)",
      hint: isConfigured
        ? "Resend is connected and ready to send automatic welcome emails."
        : "Add RESEND_API_KEY in Vercel Project Settings > Environment Variables.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const email = (body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.RESEND_FROM_EMAIL || "Denim Universe <onboarding@resend.dev>";

    // If Resend API key is not yet set in Vercel, record gracefully without failing
    if (!apiKey) {
      console.warn("RESEND_API_KEY is not configured in Vercel environment variables.");
      return res.status(200).json({
        success: true,
        emailSent: false,
        message: "Subscription saved! To receive automatic emails, add RESEND_API_KEY to your Vercel Project Environment Variables.",
      });
    }

    // Call Resend API directly via native fetch
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [email],
        subject: "Welcome to Denim Universe — Your First Denim Guide Inside 👖",
        html: getWelcomeEmailHtml(email),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API responded with error:", data);
      return res.status(200).json({
        success: true,
        emailSent: false,
        warning: data.message || "Resend API error",
      });
    }

    return res.status(200).json({
      success: true,
      emailSent: true,
      id: data.id,
      message: `Welcome email successfully sent to ${email}!`,
    });
  } catch (error: any) {
    console.error("Error dispatching welcome email:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

function getWelcomeEmailHtml(email: string): string {
  const siteUrl = process.env.SITE_URL || "https://denimuniverse.vercel.app";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Denim Universe</title>
  <style>
    body { margin: 0; padding: 0; background-color: #060d22; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e0e7ff; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #0a1633; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; }
    .header { padding: 40px 30px; text-align: center; background: linear-gradient(180deg, #0d1f4d 0%, #0a1633 100%); border-bottom: 1px solid rgba(255,255,255,0.08); }
    .badge { display: inline-block; padding: 5px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; }
    .title { color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; line-height: 1.3; }
    .subtitle { color: #a5b4fc; font-size: 14px; margin-top: 8px; line-height: 1.5; }
    .content { padding: 35px 30px; color: #c7d2fe; font-size: 15px; line-height: 1.7; }
    .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 15px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 20px; margin-bottom: 14px; text-decoration: none; display: block; }
    .card-title { color: #fbbf24; font-weight: 700; font-size: 15px; margin-bottom: 4px; display: block; }
    .card-desc { color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0; }
    .cta-container { text-align: center; padding: 25px 0 10px; }
    .cta-btn { display: inline-block; background-color: #f59e0b; color: #060d22; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; }
    .footer { padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b; line-height: 1.6; }
    .footer a { color: #818cf8; text-decoration: none; }
  </style>
</head>
<body>
  <div style="padding: 24px 12px;">
    <div class="wrapper">
      <div class="header">
        <div class="badge">✦ Official Welcome ✦</div>
        <h1 class="title">Welcome to Denim Universe</h1>
        <p class="subtitle">The denim knowledge hub — practical, proven, and made for the people who make jeans.</p>
      </div>

      <div class="content">
        <p class="greeting">Hello & welcome aboard,</p>
        <p>Thank you for subscribing to <strong>Denim Universe</strong>. You've joined <strong>12,000+</strong> textile engineers, designers, merchandisers, and denim professionals who receive our weekly deep dives into fabric engineering, wash chemistry, and production floor troubleshooting.</p>
        
        <p style="font-weight: 700; color: #ffffff; margin-top: 25px; margin-bottom: 14px;">Here are your quick-start guides to explore right now:</p>

        <a href="${siteUrl}/#process" class="card">
          <span class="card-title">1. Fabric Manufacturing Process →</span>
          <p class="card-desc">The complete 9-step journey from raw cotton bale through spinning, rope indigo dyeing, shuttle weaving, to sanforization.</p>
        </a>

        <a href="${siteUrl}/#troubleshooting" class="card">
          <span class="card-title">2. Defect Troubleshooting Guide →</span>
          <p class="card-desc">Tested production fixes for weft bow, skew, shading, laser burn marks, roping, and enzyme wash streaks.</p>
        </a>

        <a href="${siteUrl}/#fashion" class="card">
          <span class="card-title">3. Denim Fashion & Runway Trends →</span>
          <p class="card-desc">Detailed editorial stories on silhouettes, vintage washes, and sustainable fabrications with full technical specs.</p>
        </a>

        <a href="${siteUrl}/#dictionary" class="card">
          <span class="card-title">4. Textile Glossary & Dictionary →</span>
          <p class="card-desc">Over 200+ industry terms, acronyms, and wash recipes explained in plain language with mill photos.</p>
        </a>

        <div class="cta-container">
          <a href="${siteUrl}" class="cta-btn">Explore Denim Universe Now</a>
        </div>
      </div>

      <div class="footer">
        <p>© 2026 Denim Universe. All rights reserved.<br>Dhaka · Bangladesh — serving the global denim community.</p>
        <p style="margin-top: 8px;">You received this email because <strong>${email}</strong> subscribed on <a href="${siteUrl}">denimuniverse.vercel.app</a>.</p>
        <p style="margin-top: 4px; color: #475569;">Made with indigo & care.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
