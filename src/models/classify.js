import mongoose from "mongoose";

const classifySchema = new mongoose.Schema({
  value: { type: String, required: true }
})

export default mongoose.model("Classify", classifySchema);