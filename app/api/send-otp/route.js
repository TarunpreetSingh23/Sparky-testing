import twilio from "twilio";
import { connects } from "@/dbconfig/dbconfig";
import Otp from "@/models/Otp";
import { normalizePhoneNumber, getTestCredentials } from "@/lib/testAuth";

export async function POST(req) {
  try {
    const body = await req.json();
    const rawPhone = body?.phone;

    if (!rawPhone) {
      return Response.json({ error: "Phone number is required" }, { status: 400 });
    }

    const normalizedPhone = normalizePhoneNumber(rawPhone);
    if (normalizedPhone.length !== 10) {
      return Response.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    await connects();

    // 1. Check if Test Credentials apply (Dev only / explicitly enabled)
    const testCreds = getTestCredentials();
    if (testCreds && normalizedPhone === testCreds.phone) {
      // Remove previous OTPs
      await Otp.deleteMany({ phone: normalizedPhone });

      // Save configured test OTP in DB with 10 minute expiry
      await Otp.create({
        phone: normalizedPhone,
        otp: testCreds.otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      });

      // Never expose test OTP in frontend response
      return Response.json({
        success: true,
        message: "OTP sent successfully",
      });
    }

    // 2. Normal Real OTP Flow
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTPs
    await Otp.deleteMany({ phone: normalizedPhone });

    // Save new OTP (5 minute expiry)
    await Otp.create({
      phone: normalizedPhone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    });

    const sid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH;
    const from = process.env.TWILIO_WHATSAPP_FROM || process.env.TWILIO_PHONE;

    if (!sid || !token || !from) {
      console.warn("Twilio credentials not configured for WhatsApp OTP delivery");
      return Response.json(
        { error: "SMS service temporarily unavailable. Please try test login or contact support." },
        { status: 503 }
      );
    }

    const client = twilio(sid, token);
    const fromFormatted = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

    await client.messages.create({
      from: fromFormatted,
      to: `whatsapp:+91${normalizedPhone}`,
      body: `🔐 Your Sparky login OTP is ${otp}. It expires in 5 minutes.`,
    });

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return Response.json(
      { error: error?.message || "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}