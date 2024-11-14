import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  tags: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Car || mongoose.model("Car", CarSchema);
