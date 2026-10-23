/**
 * Test OTP and Authentication Helpers
 * Allows testing login using a single configured test phone number and fixed OTP.
 * Includes default test credentials so development works immediately without restarting the dev server.
 */

export function normalizePhoneNumber(phone) {
  if (!phone) return "";
  return String(phone)
    .replace("whatsapp:", "")
    .replace(/\D/g, "")
    .slice(-10);
}

export function isTestAuthAllowed() {
  const isDev = process.env.NODE_ENV !== "production";
  const explicitAllow = process.env.ALLOW_TEST_LOGIN === "true";
  return isDev || explicitAllow;
}

export function getTestCredentials() {
  if (!isTestAuthAllowed()) return null;

  const rawPhone = process.env.TEST_LOGIN_PHONE || "9999999999";
  const rawOtp = process.env.TEST_LOGIN_OTP || "123456";

  const phone = normalizePhoneNumber(rawPhone);
  const otp = String(rawOtp).trim();

  if (phone.length !== 10 || !otp) return null;

  return { phone, otp };
}
