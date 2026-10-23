import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  phone: { type: String, index: true },
  email: { type: String },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
