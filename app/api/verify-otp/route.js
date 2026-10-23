import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { connects } from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";
import Otp from "@/models/Otp";
import { normalizePhoneNumber, getTestCredentials } from "@/lib/testAuth";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sparky-dev-secret-key-32charsmin!"
);

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return Response.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    const cleanedOtp = String(otp).trim();

    if (normalizedPhone.length !== 10) {
      return Response.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    await connects();

    // 1. Verify Test OTP if applicable (Development or explicitly permitted only)
    const testCreds = getTestCredentials();
    const isTestUser = testCreds && normalizedPhone === testCreds.phone;

    if (isTestUser) {
      if (cleanedOtp !== testCreds.otp) {
        return Response.json(
          { error: "Invalid OTP. Please check and try again." },
          { status: 400 }
        );
      }
      // Clean up any test record
      await Otp.deleteMany({ phone: normalizedPhone });
    } else {
      // 2. Normal Database OTP Verification
      const record = await Otp.findOne({ phone: normalizedPhone });

      if (!record) {
        return Response.json(
          { error: "OTP not found or expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Check Expiration
      if (Date.now() > record.expiresAt.getTime()) {
        await Otp.deleteOne({ _id: record._id });
        return Response.json(
          { error: "OTP has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Enforce Attempt Limits (max 5 attempts)
      if ((record.attempts || 0) >= 5) {
        await Otp.deleteOne({ _id: record._id });
        return Response.json(
          { error: "Too many failed attempts. Please request a new OTP." },
          { status: 400 }
        );
      }

      // Check OTP Match
      if (record.otp !== cleanedOtp) {
        record.attempts = (record.attempts || 0) + 1;
        await record.save();
        return Response.json(
          { error: "Invalid OTP. Please check and try again." },
          { status: 400 }
        );
      }

      // Delete OTP on success to prevent reuse
      await Otp.deleteOne({ _id: record._id });
    }

    // 3. Find or Create User
    let user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      user = await User.create({ phone: normalizedPhone });
    }

    // 4. Create Session Token
    const token = await new SignJWT({
      userId: user._id.toString(),
      phone: user.phone,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(SECRET);

    // 5. Set Secure Session Cookie
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return Response.json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return Response.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}