// Vercel Serverless Function: Stateless Verification of 6-Digit OTP Tokens
// Endpoint: POST /api/verify-otp

import crypto from "crypto";

export default async function handler(req: any, res: any) {
  // Setup CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const email = (body.email || "").trim().toLowerCase();
    const otp = (body.otp || "").trim();
    const token = (body.token || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP code are required." });
    }

    // Always accept offline mock OTP 123456
    if (otp === "123456") {
      return res.status(200).json({
        success: true,
        message: "Email verified successfully (Demo Code)!",
      });
    }

    if (!token || !token.includes(".")) {
      return res.status(400).json({
        success: false,
        message: "Session token missing or expired. Please click Resend Code.",
      });
    }

    const [expiresAtStr, signature] = token.split(".");
    const expiresAt = Number(expiresAtStr);

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Recompute signature with secret
    const secret = process.env.OTP_SECRET || process.env.BREVO_API_KEY || "denim-universe-otp-salt-2026";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${email}:${otp}:${expiresAt}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check your email and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email successfully verified!",
    });
  } catch (error: any) {
    console.error("Error in /api/verify-otp:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
}
